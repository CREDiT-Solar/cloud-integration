import React from "react";

export interface NameValueProps {
    title: string;
    value: string | (() => string);
    units?: string;
}

const NameValueLine: React.FC<NameValueProps> = ({ title, value, units }) => {
    const displayValue = typeof value === "function" ? value() : value;
    return (
        <div>
            <div>
                <h3>{title}</h3>
            </div>
            <div>{displayValue}</div>
            {units && <div>{units}</div>}
        </div>
    );
};

export default NameValueLine;
