import React, { useState, useRef, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { Row, Col, Card, Spin, Image, Tooltip, Button, Modal } from 'antd';
import { DeleteOutlined, ZoomInOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import './ImageGrid.css';

export interface ImageData {
    src?: string;
    sliceImage?: string;
    status: string;
    message: string;
    imageID?: string;
    progress?: number;
    imageIndex?: number;
}

export interface ImageCardProps {
    image: ImageData;
    handleDelete: (image: ImageData) => void;
}



const ImageCard: React.FC<ImageCardProps> = ({ image, handleDelete }) => {

    const { src, sliceImage, status, message, imageIndex } = image;

    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);

    const handlePreview = () => {
        setIsPreviewVisible(true);
    };

    const [loading, setLoading] = useState(status !== 'generated');

    if (status === 'generated' && loading) {
        setLoading(false);
    }

    let imageSrc = "";

    if (sliceImage && sliceImage.length > 0) {
        imageSrc = sliceImage;
    } else if (src && src.length > 0) {
        imageSrc = src;
    }

    return (
        <Card
            hoverable
            style={{ width: 300, marginBottom: 16, position: 'relative' }}
            bodyStyle={{ padding: 0, height: 0 }}
            cover=

            {
                !loading ? (
                    <div style={{ width: '100%', height: 300, overflow: 'hidden' }}>
                        <Image
                            alt="example"
                            src={imageSrc}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onLoad={() => setLoading(false)}
                            preview={
                                {
                                    visible: isPreviewVisible,
                                    onVisibleChange: (visible: boolean) => setIsPreviewVisible(visible),
                                }
                            }
                        />
                        <div className="card-buttons" style={{ position: 'absolute', bottom: 8, right: 8 }}>
                            <Tooltip title="删除">
                                <Button className='tooltip-button' icon={<DeleteOutlined />} onClick={() => handleDelete(image)} />
                            </Tooltip>
                            <Tooltip title="放大">
                                <Button className='tooltip-button' icon={<ZoomInOutlined />} onClick={handlePreview} />
                            </Tooltip>
                            <Tooltip title="微调，再生成4张">
                                <Button className='tooltip-button' icon={<AppstoreAddOutlined />} />
                            </Tooltip>
                        </div>
                    </div>
                ) : (
                    <div className='progress-container'>
                        {
                            imageSrc && imageSrc.length > 0 ? (<img src={imageSrc} className={"progress-image-" + imageIndex} alt={"progress-image-" + imageIndex}>
                            </img>) : null
                        }
                        <Spin></Spin>
                        <div style={{ textAlign: "center", padding: "16px", zIndex: "1" }}>{message}</div>
                    </div>
                )

            }
        />
    );
};

interface ImageGridProps {
    images: ImageData[];
    handleDelete: (image: ImageData) => void;
}

export interface ChildComponentHandle {
    scrollToBottom: () => void;
}

const ImageGrid = (
    props: ImageGridProps,
    ref: ForwardedRef<ChildComponentHandle>) => {
    const scrollDivRef = useRef<HTMLDivElement>(null);
    const {images, handleDelete } = props;

    const scrollToBottom = () => {
        if (scrollDivRef.current) {
            scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight;
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState<ImageData | undefined>(undefined);

    const handleOk = () => {
        setIsModalOpen(false);
        if (image) {
            handleDelete(image);
            setImage(undefined);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setImage(undefined);
    };

    useImperativeHandle(ref, () => ({
        scrollToBottom,
    }));

    return (
        <div className='image-grid-container' ref={scrollDivRef}>
            <Row gutter={[16, 16]}>
                {images.map((image, index) => (
                    <Col key={index}>
                        <ImageCard image={image} handleDelete={() => {
                            setIsModalOpen(true);
                            setImage(image);
                        }} />
                    </Col>
                ))}
            </Row>
            <Modal title="删除图片！"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="取消" // Change the cancel button text
                okText="确定" // Change the ok button text
            >
                <p>即将删除选中的图片</p>
                <p>是否确认？</p>
            </Modal>
        </div>
    );
};

export default forwardRef(ImageGrid);