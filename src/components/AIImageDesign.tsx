import React, { useState, useEffect, useRef } from "react";
import { Button } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { ColorPicker } from "antd";
import { message, Upload, Card, Row, Col, Radio, UploadFile, Tooltip } from 'antd';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import ImageGrid, { ImageData, ChildComponentHandle } from "./ImageGrid";
import { ColorNames, ColorCodes } from './Colors'
import { SliceImage } from './SliceImage'
import './AIImageDesign.css'
import LongImage from '../assets/long.png'
import ShortImage from '../assets/short.png'
import MiddleImage from '../assets/middle.png'
import EmptyImage from '../assets/empty.png'


const { Dragger } = Upload;


interface SketchUploadProps {
    handleImageUpload: (base64String: string) => void;
    base64String: string | undefined;
}

const SketchUpload: React.FC<SketchUploadProps> = ({ handleImageUpload, base64String }) => {
    const [imageString, setImageString] = useState<string>("");
    const beforeUpload = (file: UploadFile): boolean => {
        const isImage = file.type?.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image file!');
        }
        return isImage || false;
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setImageString("")
    }

    const customRequest = (options: any) => {
        const file: File = options.file;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                const base64 = e.target.result as string;
                handleImageUpload(base64);
                setImageString(base64);
            }
        };
        reader.readAsDataURL(file);
    };

    const dragProps = {
        name: 'file',
        multiple: false,
        beforeUpload,
        showUploadList: false,
        customRequest,
    }


    return <Dragger {...dragProps}>
        {imageString && imageString.length > 0 ? (
            <div className="uploader" style={{ marginTop: '16px', position: "relative" }}>
                <img src={imageString} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                <Tooltip title="清除" >
                    <Button className='tooltip-button' icon={<DeleteOutlined />} onClick={handleClear} />
                </Tooltip>
            </div>
        ) : (
            <div>
                <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined style={{ fontSize: "28px", color: "gray" }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: "15px" }}>参考图</p>
                <p className="ant-upload-hint" style={{ marginBlockEnd: "0.5em", marginBlockStart: "0.5em" }}>
                    支持拖拽上传
                </p>
            </div>)}
    </Dragger>
}

interface ColorSelectorProps {
    updateColor: (value: string) => void;
}


const ColorSelector: React.FC<ColorSelectorProps> = ({ updateColor }) => {
    const [color, setColor] = useState<string>('rgba(255, 0, 0, 0)');
    const [name, setName] = useState<string>('');

    const handleChange = (color: Color) => {
        setColor(color.toRgbString());
        const index = ColorCodes.indexOf(color.toHexString().toUpperCase());
        if (index === -1 || index >= ColorNames.length) {
            setName("undefined!");
            updateColor("");
            return;
        }
        setName(ColorNames[index]);
        updateColor(ColorNames[index]);
    }

    return <div className="color-selector-container">
        <h1 className="color-selector-title">颜色:</h1>
        {/* <SwatchesPicker/> */}
        <ColorPicker
            allowClear
            value={color}
            defaultValue={undefined}
            onChange={handleChange}
            presets={[
                {
                    label: '调色盘',
                    colors: ColorCodes,
                },
                {
                    label: '最近使用',
                    colors: [],
                },
            ]}
        />
        <span className="color-selector-name">{name}</span>
    </div>
}

interface StyleSelectorProps {
    updateStyle: (value: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ updateStyle }) => {

    const [style, setStyle] = useState<string>('');


    return <Row style={{ marginBottom: '16px' }} gutter={8}>
        <Col style={{ paddingBottom: "16px", paddingTop: "8px" }} span={24}> <h1 className="color-selector-title">款式：</h1></Col>
        <Col span={8}>
            <Card bodyStyle={{ padding: 0, height: "30px" }}
                style={{ border: style === "Long Down Coat" ? "1px solid #1677ff" : "none" }}
                hoverable cover={<img alt="long" src={LongImage} style={{ padding: "2px" }}
                    onClick={() => {
                        const tmp = style === "Long Down Coat" ? "" : "Long Down Coat";
                        setStyle(tmp);
                        updateStyle(tmp);
                    }} />}>
                <Card.Meta style={{ textAlign: "center" }} title="长款" />
            </Card>
        </Col>
        <Col span={8}>
            <Card bodyStyle={{ padding: 0, height: "30px" }}
                style={{ border: style === "Down Coat" ? "1px solid #1677ff" : "none" }}
                hoverable cover={<img alt="long" src={MiddleImage} style={{ padding: "2px" }}
                    onClick={() => {
                        const tmp = style === "Down Coat" ? "" : "Down Coat";
                        setStyle(tmp);
                        updateStyle(tmp);
                    }} />}>
                <Card.Meta style={{ textAlign: "center" }} title="中款" />
            </Card>
        </Col>
        <Col span={8}>
            <Card bodyStyle={{ padding: 0, height: "30px" }}
                style={{ border: style === "Down Jacket" ? "1px solid #1677ff" : "none" }}
                hoverable cover={<img alt="long" src={ShortImage} style={{ padding: "2px" }}
                    onClick={() => {
                        const tmp = style === "Down Jacket" ? "" : "Down Jacket";
                        setStyle(tmp);
                        updateStyle(tmp);
                    }} />}>
                <Card.Meta style={{ textAlign: "center" }} title="短款" />
            </Card>
        </Col>
    </Row>
}

interface ClothSelectorProps {
    updateCloth: (value: string) => void;
}

const ClothSelector: React.FC<ClothSelectorProps> = ({ updateCloth }) => {
    const [value, setValue] = useState("");

    const onChange = (e: RadioChangeEvent) => {
        const newValue = e.target.value === value ? "" : e.target.value;
        setValue(newValue);
        updateCloth(newValue);
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <h1 style={{ marginBottom: '8px' }} className="color-selector-title">面料：</h1>
            <Radio.Group onChange={onChange} value={value}>
                <Radio value="">无设置</Radio>
                <Radio value="Nylon">尼龙</Radio>
                <Radio value="Polyester">涤纶</Radio>
                <Radio value="Cotton">棉</Radio>
                <Radio value="Non-woven">无纺布</Radio>
                <Radio value="Wool">羊毛</Radio>
                <Radio value="Coated Nylon">涂层尼龙</Radio>
                <Radio value="Spandex">氨纶</Radio>
            </Radio.Group>
        </div>
    );
};

interface SilhouetteSelectorProps {
    updateSilhouette: (value: string) => void;
}

const SilhouetteSelector: React.FC<SilhouetteSelectorProps> = ({ updateSilhouette }) => {
    const [value, setValue] = useState("");

    const onChange = (e: RadioChangeEvent) => {
        const newValue = e.target.value === value ? "" : e.target.value;
        setValue(newValue);
        updateSilhouette(newValue);
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <h1 style={{ marginBottom: '8px' }} className="color-selector-title">版型：</h1>
            <Radio.Group onChange={onChange} value={value}>
                <Radio value="">无设置</Radio>
                <Radio value="Slim Fit">修身</Radio>
                <Radio value="Straight Fit">直筒</Radio>
                <Radio value="Loose Fit">宽松</Radio>
                <Radio value="A-line Fit">A 字</Radio>
                <Radio value="High-waist Fit">高腰</Radio>
            </Radio.Group>
        </div>
    );
};

interface EditPanelProps {
    handleSubmit: (prompt: string, base64Image: string | undefined) => void;
}

function generatePrompt(color: string, style: string, cloth: string, silhouette: string) {
    return `a woman's ${style.length > 0 ? style : "Down Jacket"},${color.length > 0 ? " " + color + " color," : ""}${cloth.length > 0 ? " made of " + cloth + " fabric," : ""}${silhouette.length > 0 ? " " + silhouette + "," : ""} white background --no woman, human, person, man`
}


const EditorPanel: React.FC<EditPanelProps> = ({ handleSubmit }) => {

    var color = "";
    var style = "";
    var cloth = "";
    var silhouette = "";
    var base64 = "";

    const handleImageUpload = (base64Image: string | undefined) => {
        base64 = base64Image!;
    }

    const handleGenerate = () => {
        handleSubmit(generatePrompt(color, style, cloth, silhouette), base64);
    }


    return <div className="AIImage-edit-panel">
        <h1 className="editor-title">设计参数</h1>
        <SketchUpload base64String={base64} handleImageUpload={handleImageUpload} />
        <div style={{ padding: "20px" }}></div>
        <ColorSelector updateColor={(value: string) => {
            color = value;
        }} />
        <StyleSelector updateStyle={(value: string) => {
            style = value;
        }} />
        <ClothSelector updateCloth={(value: string) => {
            cloth = value;
        }} />
        <SilhouetteSelector updateSilhouette={(value: string) => {
            silhouette = value;
        }} />
        <Button type="primary" block onClick={handleGenerate}>生成</Button>
    </div>
}

const EmptyResult: React.FC = () => {
    return <div className="AIImage-result-panel">
        <div className="generate-empty-container">
            <img className="generate-empty-img" src={EmptyImage} alt="empty" />
            <div className="generate-empty-title">灵感设计 🎉</div>
            <div className="generate-empty-desc">快去左侧输入你的灵感创意吧~</div>
        </div>
    </div>
}

type ApiResponse = {
    status: 'NOT_START' | 'SUBMITTED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
    imageUrl: string;
    progress: string;
};

async function getApiStatus(taskID: string): Promise<ApiResponse> {
    // Replace this with a call to the real API
    const response = await fetch(`/mj/task/${taskID}/fetch`);
    const data: ApiResponse = await response.json();
    return data;
}

const AIImageDesign: React.FC = () => {
    var pendingImage = useRef<string>("");
    const shouldScrollRef = useRef<boolean>(false);
    const [images, setImages] = useState<ImageData[]>([]);
    var timerId = useRef<number>(0);

    const childRef = useRef<ChildComponentHandle>(null);
    useEffect(() => {
        const loadImages = () => {
            const imagesString = localStorage.getItem("images");
            if (imagesString) {
                const imageFromStorage = JSON.parse(imagesString) as ImageData[];

                var newImages: ImageData[] = [];
                var slicedImages: Set<string> = new Set();

                for (let i = 0; i < imageFromStorage.length; i++) {
                    const image = imageFromStorage[i];
                    let imageID = (image.imageID || "") + (image.src || "");
                    if (image.status === "generated" && image.src) {
                        if (!slicedImages.has(imageID)) {
                            slicedImages.add(imageID);
                            SliceImage(image.src).then((slices) => {
                                // imageFromStorage.forEach((tmp) => {
                                //     if (tmp.imageID === image.imageID && tmp.src === image.src) {
                                //         newImages.push({
                                //             ...tmp,
                                //             sliceImage: slices[tmp.imageIndex || 0]
                                //         })
                                //     }
                                // });
                                setImages((prev) =>
                                    prev.map((tmp) => {
                                        if (tmp.imageID === image.imageID && tmp.src === image.src) {
                                            return {
                                                ...tmp,
                                                sliceImage: slices[tmp.imageIndex || 0],
                                                status: "generated"
                                            }
                                        }
                                        return tmp;
                                    }
                                    ));
                            });
                        }
                        newImages.push({
                            ...image,
                            status: "Loading",
                            message: "正在加载图片"
                        });
                    } else if (image.imageID && (image.status === "in progress" || image.status === "submitted")) {
                        if (pendingImage.current === "") {
                            pendingImage.current = image.imageID;
                            const interval = 5000; // 0.5 seconds
                            const id = window.setInterval(checkStatus, interval);
                            timerId.current = id;
                        }
                        newImages.push(image);
                    }
                };

                setImages(newImages);
            }
        };
        loadImages();
    }, []);

    useEffect(() => {
        if (images.length > 0) {
            const imagesString = JSON.stringify(images.map((image) => {
                return {
                    status: image.status,
                    message: image.message,
                    imageIndex: image.imageIndex,
                    imageID: image.imageID,
                    src: image.src,
                    progress: image.progress
                }
            }));
            localStorage.setItem('images', imagesString);
        }
        if (shouldScrollRef.current) {
            shouldScrollRef.current = false;
            childRef.current?.scrollToBottom();
        }
    }, [images]);

    const checkStatus = async () => {
        if (pendingImage.current === "") {
            console.log('No pending image');
            return;
        }
        const response = await getApiStatus(pendingImage.current);

        if (response.status === 'SUCCESS') {
            console.log('API job is finished');
            if (timerId) {
                clearInterval(timerId.current);
                timerId.current = 0;
            }
            let pendingImageID = pendingImage.current;
            pendingImage.current = "";
            let imageUrl = response.imageUrl;
            let slices = await SliceImage(imageUrl);
            setImages((prevImages) =>
                prevImages.map((image) => {
                    let tmpImage = { ...image };
                    if (tmpImage.imageID === pendingImageID) {
                        tmpImage.status = 'generated';
                        tmpImage.message = "完成！";
                        tmpImage.progress = parseInt(response.progress.replace("%", ""))
                        tmpImage.sliceImage = slices[tmpImage.imageIndex || 0];
                        tmpImage.src = imageUrl;
                    }
                    return tmpImage;
                })
            );
        } else if (response.status === 'IN_PROGRESS') {
            let imageUrl = response.imageUrl;
            if (imageUrl && imageUrl.length > 0) {
                const percent = parseInt(response.progress.replace("%", ""))
                setImages((prevImages) =>
                    prevImages.map((image) => {
                        let tmpImage = { ...image };
                        if (tmpImage.imageID === pendingImage.current && (!tmpImage.progress || tmpImage.progress < percent)) {
                            tmpImage.status = 'in progress';
                            tmpImage.message = "生成中..." + response.progress;
                            tmpImage.progress = percent
                            tmpImage.sliceImage = imageUrl;
                        }
                        return tmpImage;
                    }))
            } else {
                setImages((prevImages) =>
                    prevImages.map((image) => {
                        let tmpImage = { ...image };
                        if (tmpImage.imageID === pendingImage.current) {
                            tmpImage.status = 'in progress';
                            tmpImage.message = "排队中，请稍后..."
                        }
                        return tmpImage;
                    }))
            }



        } else if (response.status === 'NOT_START' || response.status === 'SUBMITTED') {
            console.log(response);
        } else {
            console.log('API job failed');
            pendingImage.current = "";
            console.log(response);
        }
    };
    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });

        return response.json(); // parses JSON response into native JavaScript objects
    }

    const handleDelete = (image: ImageData) => {
        if (pendingImage.current.length > 0) {
            message.error("请等待上一张图片生成完成");
            return;
        }
        var deleteLastOne = false;
        setImages((prevImages) => prevImages.filter(
            (tmp) => {
                if (tmp.imageID === image.imageID && tmp.imageIndex === image.imageIndex) {
                    if (images.length === 1) {
                        deleteLastOne = true;
                    }
                    return false;
                }
                return true;
            }
        ));
        if (deleteLastOne) {
            localStorage.removeItem("images");
        }
    }

    const handleVariation = async (image: ImageData) => {
        if (pendingImage.current.length > 0) {
            message.error("请等待上一张图片生成完成");
            return;
        }

        try {
            const response = await postData('/mj/submit/change', {
                action: "VARIATION",
                index: image.imageIndex || 0 + 1,
                taskId: image.imageID
            });
            if (response.code === 1) {
                shouldScrollRef.current = true;
                message.success(response.description);
                pendingImage.current = response.result;
                let tmpImages = [...images];
                for (let i = 0; i < 4; i++) {
                    tmpImages.push({
                        status: "submitted",
                        message: "已提交，等待中...",
                        imageID: pendingImage.current,
                        imageIndex: i
                    });
                }
                setImages(tmpImages);
                const interval = 5000; // 0.5 seconds
                const id = window.setInterval(checkStatus, interval);
                timerId.current = id;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSubmit = async (prompt: string, base64Image: string | undefined) => {

        if (pendingImage.current.length > 0) {
            message.error("请等待上一张图片生成完成");
            return;
        }

        const data = {
            base64: base64Image,
            prompt: prompt,
        };

        try {
            const response = await postData('/mj/submit/imagine', data);
            //   const response = {
            //     code: 1,
            //     result: '0564942927917391',
            //     description: 'success'
            //   }
            if (response.code === 1) {
                shouldScrollRef.current = true;
                message.success(response.description);
                pendingImage.current = response.result;
                let tmpImages = [...images];
                for (let i = 0; i < 4; i++) {
                    tmpImages.push({
                        status: "submitted",
                        message: "已提交，等待中...",
                        imageID: pendingImage.current,
                        imageIndex: i
                    });
                }
                setImages(tmpImages);
                const interval = 5000; // 0.5 seconds
                const id = window.setInterval(checkStatus, interval);
                timerId.current = id;
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };
    return <div className="AIImage-Design-container">
        <EditorPanel handleSubmit={handleSubmit} />
        {images.length === 0 ? <EmptyResult /> : <ImageGrid ref={childRef} images={images} handleDelete={handleDelete} handleVariation={handleVariation} />}
    </div>
}

export default AIImageDesign;