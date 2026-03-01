"use client";

import React from "react";

export function MaterialIcons() {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
                media="print"
                onLoad={(e: React.SyntheticEvent<HTMLLinkElement>) => {
                    e.currentTarget.media = 'all';
                }}
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                media="print"
                onLoad={(e: React.SyntheticEvent<HTMLLinkElement>) => {
                    e.currentTarget.media = 'all';
                }}
            />
            <noscript>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </noscript>
        </>
    );
}
