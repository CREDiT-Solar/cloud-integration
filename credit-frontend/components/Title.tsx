import React from "react";

export interface TitleProps {
    title: string;
    subtitle?: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle }) => {
    return (
        <div>
            <div>
                <h3>{title}</h3>
            </div>
            {subtitle && <div>{subtitle}</div>}
        </div>
    );
};

export default Title;
