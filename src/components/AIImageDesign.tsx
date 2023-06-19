import React, { useState } from "react";
import { Button, UploadProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { ColorPicker } from "antd";
import { message, Upload, Card, Row, Col, Radio, UploadFile  } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import ImageGrid, {ImageCardProps} from "./ImageGrid";
import './AIImageDesign.css'
import LongImage from '../assets/long.png'
import ShortImage from '../assets/short.png'
import MiddleImage from '../assets/middle.png'
import EmptyImage from '../assets/empty.png'


const { Dragger } = Upload;


const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

interface CustomRequestOptions {
    file: UploadFile;
    onSuccess: (response: any, file: UploadFile) => void;
    onError: (error: any, response: any) => void;
    onProgress: (e: { percent: number }, file: UploadFile) => void;
    data?: Object;
    headers?: Object;
    withCredentials?: boolean;
    action?: string;
}

interface SketchUploadProps {
    handleImageUpload: (base64String: string) => void;
    base64String: string | undefined;
}

const SketchUpload: React.FC<SketchUploadProps> = ({handleImageUpload, base64String}) => {
    const beforeUpload = (file: UploadFile): boolean => {
        const isImage = file.type?.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image file!');
        }
        return isImage || false;
    }

    const customRequest = (options: any) => {
        const file: File = options.file;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                const base64 = e.target.result as string;
                handleImageUpload(base64);
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
        {base64String && base64String.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
                <img src={base64String} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
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

const ColorCodes = ["#800000", "#8B0000", "#A52A2A", "#B22222", "#DC143C", "#FF0000", "#FF6347", "#FF7F50", "#CD5C5C", "#F08080", "#E9967A", "#FA8072", "#FFA07A", "#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#B8860B", "#DAA520", "#EEE8AA", "#BDB76B", "#F0E68C", "#808000", "#FFFF00", "#9ACD32", "#556B2F", "#6B8E23", "#7CFC00", "#7FFF00", "#ADFF2F", "#006400", "#008000", "#228B22", "#00FF00", "#32CD32", "#90EE90", "#98FB98", "#8FBC8F", "#00FA9A", "#00FF7F", "#2E8B57", "#66CDAA", "#3CB371", "#20B2AA", "#2F4F4F", "#008080", "#008B8B", "#00FFFF", "#E0FFFF", "#00CED1", "#40E0D0", "#48D1CC", "#AFEEEE", "#7FFFD4", "#B0E0E6", "#5F9EA0", "#4682B4", "#6495ED", "#00BFFF", "#1E90FF", "#ADD8E6", "#87CEEB", "#87CEFA", "#191970", "#000080", "#00008B", "#0000CD", "#0000FF", "#4169E1", "#8A2BE2", "#4B0082", "#483D8B", "#6A5ACD", "#7B68EE", "#9370DB", "#8B008B", "#9400D3", "#9932CC", "#BA55D3", "#800080", "#D8BFD8", "#DDA0DD", "#EE82EE", "#FF00FF", "#DA70D6", "#C71585", "#DB7093", "#FF1493", "#FF69B4", "#FFB6C1", "#FFC0CB", "#FAEBD7", "#F5F5DC", "#FFE4C4", "#FFEBCD", "#F5DEB3", "#FFF8DC", "#FFFACD", "#FAFAD2", "#FFFFE0", "#8B4513", "#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#D2B48C", "#BC8F8F", "#FFE4B5", "#FFDEAD", "#FFDAB9", "#FFE4E1", "#FFF0F5", "#FAF0E6", "#FDF5E6", "#FFEFD5", "#FFF5EE", "#F5FFFA", "#708090", "#778899", "#B0C4DE", "#E6E6FA", "#FFFAF0", "#F0F8FF", "#F8F8FF", "#F0FFF0", "#FFFFF0", "#F0FFFF", "#FFFAFA", "#000000", "#696969", "#808080", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#DCDCDC", "#F5F5F5", "#FFFFFF"];
const ColorNames = ["maroon", "dark red", "brown", "firebrick", "crimson", "red", "tomato", "coral", "indian red", "light coral", "dark salmon", "salmon", "light salmon", "orange red", "dark orange", "orange", "gold", "dark golden rod", "golden rod", "pale golden rod", "dark khaki", "khaki", "olive", "yellow", "yellow green", "dark olive green", "olive drab", "lawn green",
    "chartreuse", "green yellow", "dark green", "green", "forest green", "lime", "lime green", "light green", "pale green", "dark sea green", "medium spring green", "spring green", "sea green", "medium aqua marine", "medium sea green", "light sea green", "dark slate gray", "teal", "dark cyan", "cyan", "light cyan",
    "dark turquoise", "turquoise", "medium turquoise", "pale turquoise", "aqua marine", "powder blue", "cadet blue", "steel blue", "corn flower blue", "deep sky blue", "dodger blue", "light blue", "sky blue", "light sky blue", "midnight blue", "navy", "dark blue", "medium blue", "blue", "royal blue", "blue violet", "indigo", "dark slate blue", "slate blue", "medium slate blue", "medium purple", "dark magenta", "dark violet", "dark orchid", "medium orchid", "purple", "thistle", "plum", "violet", "magenta / fuchsia", "orchid", "medium violet red", "pale violet red", "deep pink", "hot pink", "light pink", "pink", "antique white", "beige", "bisque", "blanched almond", "wheat", "corn silk", "lemon chiffon", "light golden rod yellow", "light yellow", "saddle brown", "sienna", "chocolate", "peru", "sandy brown", "burly wood", "tan", "rosy brown", "moccasin", "navajo white", "peach puff", "misty rose", "lavender blush", "linen", "old lace", "papaya whip", "sea shell", "mint cream", "slate gray", "light slate gray", "light steel blue", "lavender", "floral white", "alice blue", "ghost white", "honeydew", "ivory", "azure", "snow", "black", "dim gray / dim grey", "gray / grey", "dark gray / dark grey", "silver", "light gray / light grey", "gainsboro", "white smoke", "white"];

const ColorSelector: React.FC = () => {
    const [color, setColor] = useState<Color | string>('Transparent');
    const [name, setName] = useState<string>('transparent');

    const handleChange = (color: Color) => {
        setColor(color);
        const index = ColorCodes.indexOf(color.toHexString().toUpperCase());
        if (index === -1 || index >= ColorNames.length) {
            setName("undefined!");
            return;
        }
        setName(ColorNames[index]);
    }

    return <div className="color-selector-container">
        <h1 className="color-selector-title">颜色:</h1>
        {/* <SwatchesPicker/> */}
        <ColorPicker
            allowClear
            onChange={handleChange}
            presets={[
                {
                    label: 'Recommended',
                    colors: ColorCodes,
                },
                {
                    label: 'Recent',
                    colors: [],
                },
            ]}
        />
        <span className="color-selector-name">{name}</span>
    </div>
}

const StyleSelector: React.FC = () => {
    return <Row style={{marginBottom:'16px'}} gutter={8}>
        <Col style={{ paddingBottom: "16px", paddingTop: "8px" }} span={24}> <h1 className="color-selector-title">款式：</h1></Col>
        <Col span={8}>
            <Card bodyStyle={{ padding: 0, height:"30px" }} hoverable cover={<img alt="long" src={LongImage} style={{padding:"2px"}} />}>
                <Card.Meta style={{textAlign:"center"}} title="长款" />
            </Card>
        </Col>
        <Col span={8}>
            <Card bodyStyle={{ padding: 0, height:"30px" }} style={{border: "1px solid blue"}} hoverable cover={<img alt="middle" src={MiddleImage} style={{padding:"2px"}} />}>
                <Card.Meta style={{textAlign:"center"}} title="中款" />
            </Card>
        </Col>
        <Col span={8}>
            <Card bodyStyle={{ padding: 0, height:"30px" }} hoverable cover={<img alt="short" src={ShortImage} style={{padding:"2px"}} />}>
                <Card.Meta style={{textAlign:"center"}} title="短款" />
            </Card>
        </Col>
    </Row>
}

const ClothSelector: React.FC = () => {
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div style={{marginBottom:'16px'}}>
            <h1 style={{marginBottom:'8px'}} className="color-selector-title">面料：</h1>
            <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>尼龙</Radio>
                <Radio value={2}>涤纶</Radio>
                <Radio value={3}>麻棉</Radio>
                <Radio value={4}>羊绒</Radio>
                <Radio value={5}>莫代尔</Radio>
                <Radio value={6}>防水布</Radio>
                <Radio value={7}>防风布</Radio>
            </Radio.Group>
        </div>
    );
};

const MadeSelector: React.FC = () => {
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div style={{marginBottom:'16px'}}>
            <h1 style={{marginBottom:'8px'}} className="color-selector-title">品牌：</h1>
            <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>加拿大鹅</Radio>
                <Radio value={2}>波司登</Radio>
                <Radio value={3}>北面</Radio>
                <Radio value={4}>哥伦比亚</Radio>
                <Radio value={5}>马克华菲</Radio>
                <Radio value={6}>爱斯卡达</Radio>
                <Radio value={7}>阿迪达斯</Radio>
            </Radio.Group>
        </div>
    );
};

interface EditPanelProps {
    handleSubmit: () => void;
    handleImageUpload: (base64String: string) => void;
    base64String: string | undefined;
}


const EditorPanel: React.FC<EditPanelProps> = ({handleSubmit, base64String, handleImageUpload}) => {
    return <div className="AIImage-edit-panel">
        <h1 className="editor-title">设计参数</h1>
        <SketchUpload base64String={base64String} handleImageUpload={handleImageUpload}/>
        <div style={{padding:"20px"}}></div>
        <ColorSelector />
        <StyleSelector />
        <ClothSelector />
        {/* <MadeSelector /> */}
        <Button type="primary" block onClick={handleSubmit}>生成</Button>
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

const testImages = [
    "https://cdn.discordapp.com/attachments/1091550235068747820/1113745900607643780/ericdengjun_3581485159994937_b5a7f64a-1d79-4546-ae64-3e1089f91a7b.png",
    "https://cdn.discordapp.com/attachments/1091550235068747820/1113745869045506089/ericdengjun_3581485159994937_25baad77-0021-4630-b44f-25a49d9ba800.png",
    "https://cdn.discordapp.com/attachments/1091550235068747820/1113745851253260338/ericdengjun_3581485159994937_cff0c316-c8cc-4add-b4d1-f0214e4b42d5.png",
    "https://cdn.discordapp.com/attachments/1091550235068747820/1113745838032814100/ericdengjun_3581485159994937_af5444ab-999a-4bb9-9304-c58420ebb570.png"
];

type ApiResponse = {
    status: 'NOT_START' | 'SUBMITTED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
};

async function getApiStatus(taskID: string): Promise<ApiResponse> {
    // Replace this with a call to the real API
    const response = await fetch(`/mj/task/${taskID}/fetch`);
    const data: ApiResponse = await response.json();
    return data;
}


const AIImageDesign: React.FC = () => {
    const [imageBase64, setImageBase64] = useState("");
    var pendingImage = "";
    const [images, setImages] = useState<ImageCardProps[]>([]);
    var timerId = 0;

    const checkStatus = async () => {
        const response = await getApiStatus(pendingImage);

        if (response.status === 'SUCCESS') {
            console.log('API job is finished');
            if (timerId) {
                clearInterval(timerId);
                timerId = 0;
            }
            setImages((prevImages) =>
                prevImages.map((image) => {
                    let tmpImage = { ...image };
                    if (tmpImage.pendingID === pendingImage) {
                        tmpImage.status = 'generated';
                    }
                    return tmpImage;
                })
            );
        } else {
            console.log('API job is still pending');
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

      const handleSubmit = async () => {
        const data = {
          prompt: 'a woman\'s down coat, blue color, white background --no person'
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
                    status: "generating",
                    src: "",
                    message: "正在生成中...",
                    pendingID: pendingImage,
                    imageIndex: i
                });
            }
            setImages(tmpImages);
            const interval = 5000; // 0.5 seconds
            const id = window.setInterval(checkStatus, interval);
            timerId = id;
          }

          console.log('Response:', response);
        } catch (error) {
          console.error('Error:', error);
        }
      };
    return <div className="AIImage-Design-container">
        <EditorPanel handleSubmit={handleSubmit} base64String={imageBase64} handleImageUpload={(base64String) => {
            setImageBase64(base64String);
        }}/>
        {images.length === 0 ? <EmptyResult /> : <ImageGrid images={images} />}
    </div>
}

export default AIImageDesign;