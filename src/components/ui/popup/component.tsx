'use client';

import { FC, useState } from "react";
import { PopupProps } from "./interface";


const PopupComponent: FC<PopupProps> = ({ title }) => {
    const [isVisible, setIsVisible] = useState(false);

    const openPopup = () => setIsVisible(true);
    const closePopup = () => setIsVisible(false);

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={openPopup}
                className="truncate"
            >
                {title}
            </button>

            {/* Popup */}
            {isVisible && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75 z-[999] flex items-center justify-center">
                    <div className="absolute left-1/2 top-1/2 w-[300px] -ml-[150px] bg-white p-10 transform -translate-y-1/2">
                        <h2 className="text-lg font-bold mb-4">This is a popup</h2>
                        <p className="mb-4">You can put any content here.</p>
                        <button
                            onClick={closePopup}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopupComponent;
