import React, { useState, useEffect } from "react";
import { Button } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { ColorPicker } from "antd";
import { message, Upload, Card, Row, Col, Radio, UploadFile, Tooltip } from 'antd';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import ImageGrid, { ImageData } from "./ImageGrid";
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

const testImages: ImageData[] = [
    {
        status: "submited",
        message: "已提交，等待中..."
    },
    {
        status: "generated",
        message: "正在生成中...: 31%",
        imageIndex: 0,
        src: "https://cdn.discordapp.com/attachments/1091550235068747820/1121592705387081808/ericdengjun_8574459851782432_a_womans_Long_Down_Coat_white_back_3b95cb7f-964f-4f15-a570-e1ad9f02f569.png"
    },
    {
        status: "in progress",
        message: "正在生成中...: 31%",
        imageIndex: 1,
        src: "https://cdn.discordapp.com/attachments/1091550235068747820/1121592705387081808/ericdengjun_8574459851782432_a_womans_Long_Down_Coat_white_back_3b95cb7f-964f-4f15-a570-e1ad9f02f569.png"
    },
    {
        status: "in progress",
        message: "正在生成中...: 31%",
        imageIndex: 2,
        src: "https://cdn.discordapp.com/attachments/1091550235068747820/1121592705387081808/ericdengjun_8574459851782432_a_womans_Long_Down_Coat_white_back_3b95cb7f-964f-4f15-a570-e1ad9f02f569.png"
    },
    {
        status: "in progress",
        message: "正在生成中...: 31%",
        imageIndex: 3,
        src: "https://cdn.discordapp.com/attachments/1091550235068747820/1121592705387081808/ericdengjun_8574459851782432_a_womans_Long_Down_Coat_white_back_3b95cb7f-964f-4f15-a570-e1ad9f02f569.png"
    }
];




const AIImageDesign: React.FC = () => {
    var pendingImage = "";
    const [images, setImages] = useState<ImageData[]>([]);
    var timerId = 0;

    useEffect(() => {
        const loadImages = () => {
            const imagesString = localStorage.getItem("images");
            if (imagesString) {
                const imageFromStorage = JSON.parse(imagesString) as ImageData[];
                setImages(imageFromStorage);
            }
        };
        loadImages();
    }, []);

    useEffect(() => {
        if (images.length > 0) {
            const imagesString = JSON.stringify(images);
            localStorage.setItem('images', imagesString);
        }
    }, [images]);

    const checkStatus = async () => {
        const response = await getApiStatus(pendingImage);

        if (response.status === 'SUCCESS') {
            console.log('API job is finished');
            if (timerId) {
                clearInterval(timerId);
                timerId = 0;
            }
            let imageUrl = response.imageUrl;
            let slices = await SliceImage(imageUrl);
            setImages((prevImages) =>
                prevImages.map((image) => {
                    let tmpImage = { ...image };
                    if (tmpImage.imageID === pendingImage) {
                        tmpImage.status = 'generated';
                        tmpImage.message = "完成！";
                        tmpImage.progress = parseInt(response.progress.replace("%", ""))
                        tmpImage.sliceImage = slices[tmpImage.imageIndex || 0];
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
                        if (tmpImage.imageID === pendingImage && (!tmpImage.progress || tmpImage.progress < percent)) {
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
                        if (tmpImage.imageID === pendingImage) {
                            tmpImage.status = 'in progress';
                            tmpImage.message = "排队中，请稍后..."
                        }
                        return tmpImage;
                    }))
            }



        } else if (response.status === 'NOT_START') {

        } else {
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
        setImages((prevImages) => prevImages.filter(
            (tmp) => {
                if (tmp.imageID === image.imageID && tmp.imageIndex === image.imageIndex) {
                    return false;
                }
                return true;
            }
        ));
    }

    const mockSubmit = (prompt: string, base64Image: string | undefined) => {
        let tmpImages = [...images];
        for (let i = 0; i < 4; i++) {
            tmpImages.push({
                status: "generated",
                message: "生成完成",
                imageID: "0564942927917391",
                imageIndex: i,
                src: "https://cdn.discordapp.com/attachments/1091550235068747820/1121592705387081808/ericdengjun_8574459851782432_a_womans_Long_Down_Coat_white_back_3b95cb7f-964f-4f15-a570-e1ad9f02f569.png"
            });
        }
        setImages(tmpImages);
    }

    const handleSubmit = async (prompt: string, base64Image: string | undefined) => {
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
                message.success(response.description);
                pendingImage = response.result;
                let tmpImages = [...images];
                for (let i = 0; i < 4; i++) {
                    tmpImages.push({
                        status: "submited",
                        message: "已提交，等待中...",
                        imageID: pendingImage,
                        imageIndex: i
                    });
                }
                setImages(tmpImages);
                const interval = 5000; // 0.5 seconds
                const id = window.setInterval(checkStatus, interval);
                timerId = id;
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };
    return <div className="AIImage-Design-container">
        <EditorPanel handleSubmit={handleSubmit} />
        {images.length === 0 ? <EmptyResult /> : <ImageGrid images={images} handleDelete={handleDelete} />}
    </div>
}

export default AIImageDesign;