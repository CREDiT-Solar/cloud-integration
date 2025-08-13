import React from "react";
import BottomNavi from "./BottomNavi";

interface FooterProps {
  currentPage: string;
}

export default function Footer({ currentPage }: FooterProps) {
  return <BottomNavi currentPage={currentPage} />;
}
