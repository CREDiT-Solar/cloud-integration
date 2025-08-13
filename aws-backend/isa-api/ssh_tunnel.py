import paramiko
import threading
import socket
import select


class SSHTunnelManager:
    def __init__(self, ssh_host, ssh_port, ssh_user, ssh_password,
                 remote_bind_host, remote_bind_port, local_bind_host="127.0.0.1", local_bind_port=0):
        self.ssh_host = ssh_host
        self.ssh_port = ssh_port
        self.ssh_user = ssh_user
        self.ssh_password = ssh_password
        self.remote_bind_host = remote_bind_host
        self.remote_bind_port = remote_bind_port
        self.local_bind_host = local_bind_host
        self.local_bind_port = local_bind_port
        self.transport = None
        self.forward_thread = None
        self.stop_event = threading.Event()

    def start(self):
        # Connect SSH
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(
            self.ssh_host,
            port=self.ssh_port,
            username=self.ssh_user,
            password=self.ssh_password
        )
        self.transport = client.get_transport()

        # Bind local port
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind((self.local_bind_host, self.local_bind_port))
        self.local_bind_port = sock.getsockname()[1]
        sock.listen(100)

        print(f"SSH tunnel established: {self.local_bind_host}:{self.local_bind_port} -> {self.remote_bind_host}:{self.remote_bind_port}")

        # Forwarding loop in a thread
        self.forward_thread = threading.Thread(target=self._forward_loop, args=(sock,), daemon=True)
        self.forward_thread.start()

    def _forward_loop(self, sock):
        while not self.stop_event.is_set():
            r, _, _ = select.select([sock], [], [], 0.5)
            if sock in r:
                client_socket, addr = sock.accept()
                chan = self.transport.open_channel(
                    "direct-tcpip",
                    (self.remote_bind_host, self.remote_bind_port),
                    client_socket.getsockname()
                )
                # Pipe data between client_socket <-> chan
                threading.Thread(target=self._pipe, args=(client_socket, chan), daemon=True).start()

    def _pipe(self, src, dst):
        while True:
            r, _, _ = select.select([src, dst], [], [], 0.5)
            if src in r:
                data = src.recv(1024)
                if not data:
                    break
                dst.sendall(data)
            if dst in r:
                data = dst.recv(1024)
                if not data:
                    break
                src.sendall(data)
        src.close()
        dst.close()

    def ensure_tunnel(self):
        if not self.transport or not self.transport.is_active():
            print("SSH tunnel dropped — reconnecting...")
            self.start()

    def stop(self):
        self.stop_event.set()
        if self.transport:
            self.transport.close()
        print("SSH tunnel closed")
