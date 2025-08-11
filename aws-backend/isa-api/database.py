import pymysql

class Database:
    def __init__(self, host, port, user, password, name):
        self.db_host = host
        self.db_port = port
        self.db_user = user
        self.db_password = password
        self.db_name = name
        self.db_connection = pymysql.connect(
            host=self.db_host,
            port=self.db_port,
            user=self.db_user,
            password=self.db_password,
            database=self.db_name
        )
        self.cursor = self.db_connection.cursor()

    def query(self, sql, params=None):
        self.cursor.execute(sql, params or ())
        return self.cursor.fetchall()

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.db_connection:
            self.db_connection.close()
