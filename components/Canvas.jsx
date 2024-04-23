import React, { useState, useEffect, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import Ably from 'ably';
import { Button } from '@nextui-org/react';
import { BsPencilFill } from 'react-icons/bs';
import { BsFillEraserFill } from 'react-icons/bs';
import { FaUndoAlt } from 'react-icons/fa';
import { FaRedoAlt } from 'react-icons/fa';
import { HiMiniTrash } from 'react-icons/hi2';
import { MdDragHandle } from "react-icons/md";
import { BiSolidHide } from "react-icons/bi";
import { IoColorPalette } from "react-icons/io5";
import Draggable from 'react-draggable';

export default function Canvas() {
    const canvasRef = useRef();
    const colorPicker = useRef();
    const [strokeColor, setStrokeColor] = useState('#3db5ff');
    const [eraseMode, setEraseMode] = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [eraserWidth, setEraserWidth] = useState(10);
    const [isDragging, setIsDragging] = useState(false);
    const [ably, setAbly] = useState(null);

    useEffect(() => {
        (async () => {
            const ably = new Ably.Realtime({ authUrl: '/api/ably-auth' });
            ably.connection.once('connected', () => {
                console.log('Connected to Ably!');
                setAbly(ably);
            });
        })();
    }, []);

    useEffect(() => {
        if (!ably) return;
        const channel = ably.channels.get('drawing-channel');
        const subscription = channel.subscribe('drawingData', (message) => {
            canvasRef.current.loadPaths(message.data);
        });
        return () => channel.unsubscribe(subscription);
    }, [ably]);

    useEffect(() => {
        const colorPreviews = document.querySelectorAll('#update-me');
        const colorPickerBtn = document.getElementById('color-picker-btn');
        const colorPickerBtnIcon = document.getElementById('color-picker-btn-icon');
        colorPickerBtn.style.backgroundColor = strokeColor;
        if (isHexColorDark(strokeColor)) {
            colorPickerBtnIcon.style.color = 'white';
        } else {
            colorPickerBtnIcon.style.color = 'black';
        }
        colorPreviews.forEach(preview => {
            preview.style.backgroundColor = strokeColor;
        });
    }, [strokeColor]);

    const handleSketchChange = (path) => {
        if (!ably) return;
        const channel = ably.channels.get('drawing-channel');
        if (path.paths.length >= 2) {
            channel.publish('drawingData', path);
        }
    };

    function isHexColorDark(hexColor) {
        hexColor = hexColor.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    }

    const handleStrokeColorChange = (event) => {
        setStrokeColor(event.target.value);
    };

    const handleEraserClick = () => {
        setEraseMode(true);
        canvasRef.current?.eraseMode(true);
    };

    const handlePenClick = () => {
        setEraseMode(false);
        canvasRef.current?.eraseMode(false);
    };

    const handleStrokeWidthChange = (width) => {
        setStrokeWidth(width);
        setEraserWidth(width);
    };

    const handleUndoClick = () => {
        canvasRef.current?.undo();
        canvasRef.current?.undo();
    };

    const handleRedoClick = () => {
        canvasRef.current?.redo();
        canvasRef.current?.redo();
    };

    const handleResetClick = () => {
        canvasRef.current?.resetCanvas();
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMenuHide = () => {
        const menu = document.getElementById('menu');
        const isHidden = menu.getAttribute('data-hidden');

        if (isHidden === 'true') {
            menu.setAttribute('data-hidden', false);
            menu.style.display = 'flex';
        } else {
            menu.setAttribute('data-hidden', true);
            menu.style.display = 'none';
        }
    };

    const showColorPicker = () => {
        const picker = document.getElementById('color-picker');
        picker.click();
    };

    return (
        <div>
            <Draggable handle='.handle'>
                <div className='flex flex-col items-center fixed gap-2 top-0 left-0 p-4'>

                    <div
                        className={`handle flex justify-center bg-neutral-200 w-[100px] cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        <MdDragHandle fontSize={22} />
                    </div>

                    <div
                        className={`flex justify-center bg-neutral-200 w-[100px] cursor-pointer`}
                        onClick={handleMenuHide}
                    >
                        <BiSolidHide fontSize={22} />
                    </div>

                    <div id='menu' className='flex items-center flex-col gap-2 max-w-[100px]'>
                        <div className='flex gap-2'>
                            <Button
                                color={!eraseMode ? 'primary' : 'default'}
                                isIconOnly
                                startContent={<BsPencilFill fontSize={24} />}
                                disabled={!eraseMode}
                                onClick={handlePenClick}
                            />

                            <Button
                                color={eraseMode ? 'secondary' : 'default'}
                                isIconOnly
                                startContent={<BsFillEraserFill fontSize={24} />}
                                disabled={eraseMode}
                                onClick={handleEraserClick}
                            />
                        </div>

                        <div className='flex items-center flex-col gap-4'>
                            <div
                                className='flex justify-center items-center min-w-[40px] min-h-[40px] border-2 border-black rounded-full cursor-pointer'
                                onClick={() => handleStrokeWidthChange(5)}
                            >
                                <div id='update-me' className='w-[5px] h-[5px] bg-black rounded-full'></div>
                            </div>

                            <div
                                className='flex justify-center items-center min-w-[40px] min-h-[40px] border-2 border-black rounded-full cursor-pointer'
                                onClick={() => handleStrokeWidthChange(10)}
                            >
                                <div id='update-me' className='w-[10px] h-[10px] bg-black rounded-full'></div>
                            </div>

                            <div
                                className='flex justify-center items-center min-w-[41px] min-h-[41px] border-2 border-black rounded-full cursor-pointer'
                                onClick={() => handleStrokeWidthChange(15)}
                            >
                                <div id='update-me' className='w-[15px] h-[15px] bg-black rounded-full'></div>
                            </div>

                            <div
                                className='flex justify-center items-center min-w-[40px] min-h-[40px] border-2 border-black rounded-full cursor-pointer'
                                onClick={() => handleStrokeWidthChange(20)}
                            >
                                <div id='update-me' className='w-[20px] h-[20px] bg-black rounded-full'></div>
                            </div>

                            <div
                                className='flex justify-center items-center min-w-[41px] min-h-[41px] border-2 border-black rounded-full cursor-pointer'
                                onClick={() => handleStrokeWidthChange(25)}
                            >
                                <div id='update-me' className='w-[25px] h-[25px] bg-black rounded-full'></div>
                            </div>
                        </div>

                        <div className='flex items-center flex-col w-full'>
                            <div className='flex justify-center items-center'>
                                <Button
                                    id='color-picker-btn'
                                    isIconOnly
                                    className='border border-neutral-300'
                                    startContent={<IoColorPalette id='color-picker-btn-icon' fontSize={32} className='cursor-pointer' />}
                                    onClick={showColorPicker}
                                />
                                <input
                                    id='color-picker'
                                    ref={colorPicker}
                                    className=' invisible max-w-0 max-h-0'
                                    type='color'
                                    value={strokeColor}
                                    onChange={handleStrokeColorChange}
                                />
                            </div>
                        </div>

                        <div className='flex justify-center gap-2 flex-wrap'>
                            <Button
                                isIconOnly
                                startContent={<FaUndoAlt fontSize={24} />}
                                onClick={handleUndoClick}
                            />

                            <Button
                                isIconOnly
                                startContent={<FaRedoAlt fontSize={24} />}
                                onClick={handleRedoClick}
                            />

                            <Button
                                isIconOnly
                                color='danger'
                                startContent={<HiMiniTrash fontSize={24} />}
                                onClick={handleResetClick}
                            />
                        </div>
                    </div>
                </div>
            </Draggable>

            <ReactSketchCanvas
                ref={canvasRef}
                width='100'
                height='100vh'
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                eraserWidth={eraserWidth}
                onStroke={handleSketchChange}
            />
        </div>
    );
}