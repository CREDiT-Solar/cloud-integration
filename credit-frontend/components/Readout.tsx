import React from "react";

export interface ReadoutProps {
    title: string;
    value: string | (() => string);
    units?: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

const Readout: React.FC<ReadoutProps> = ({
    title,
    value,
    units,
    subtitle,
    icon,
}) => {
    const displayValue = typeof value === "function" ? value() : value;

    return (
        <div>
            <div>
                <h3>{title}</h3>
            </div>
            <div>{displayValue}</div>
            {units && <div>{units}</div>}
            {subtitle && <div>{subtitle}</div>}
            {icon && <div>{<span>{icon}</span>}</div>}
        </div>
    );
};

export default Readout;
