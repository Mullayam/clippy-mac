import React from "react";



export const Header = () => {
    return (
        <div
            className="sticky top-0 z-10 flex justify-between items-center px-4 py-2 bg-neutral-800 text-white shadow select-none"
            style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} // Makes the header draggable
        >
            <span className="text-sm font-semibold">Clip Mac</span>
            <div
                className="flex gap-2"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} // These buttons must not be draggable
            >
                <button
                    onClick={() => window.clipboardAPI.minimize()}
                    className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110"
                />
                <button
                    onClick={() => window.clipboardAPI.maximize()}
                    className="w-3 h-3 rounded-full bg-green-400 hover:brightness-110"
                />
                <button
                    onClick={() => window.clipboardAPI.close()}
                    className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
                />
            </div>
        </div>
    );
};
