"use client"
import React, { useEffect, useRef } from 'react';

export default function TradingChart() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ป้องกันการโหลด Script ซ้ำซ้อน
        if (container.current && container.current.childElementCount === 0) {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
                            {
                            "autosize": true,
                            "symbol": "FX:EURUSD",
                            "interval": "5",
                            "timezone": "Asia/Bangkok",
                            "theme": "light",
                            "style": "1",
                            "locale": "en",
                            "enable_publishing": false,
                            "backgroundColor": "rgb(255, 255, 255)",
                            "gridColor": "rgba(255, 255, 255, 0.06)",
                            "hide_top_toolbar": false,
                            "hide_legend": false,
                            "save_image": false,
                            "container_id": "tradingview_eurusd"
                            }`;
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="h-[500px] w-full rounded-md overflow-hidden border border-border">
            <div className="tradingview-widget-container__widget" ref={container} style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
}