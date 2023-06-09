import React from 'react';
import { Layout, theme } from 'antd';
import AINavigation from '../components/AINavigation';
import AIImageDesign from '../components/AIImageDesign';
import './Design.css';
import logoImage from '../assets/logo.png'

const { Header, Content, Sider } = Layout;

const Design: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{height:"100%", width:"100%", overflow: 'hidden'}}>
      <Header style={{ display: 'flex', 
                    alignItems: 'center', 
                    background:'white', 
                    paddingInline:'24px',
                    borderBottom:'1px solid rgba(0,0,0,0.08)', 
                    height: '60px'}}>
        <div className='logo-container'>
          <img src={logoImage} alt='App Logo' />
        </div>
        <span className='logo-title'>腾云AI</span>
      </Header>
      <Layout>
        <Sider width={81} style={{background: colorBgContainer, borderRight:'1px solid rgba(0,0,0,0.08)'}}>
          <AINavigation />
        </Sider>
        <Layout style={{ height:'calc(100vh - 60px)'}}>
          <Content
            style={{
              padding: 0,
              margin: 0,
              width: 'auto',
              height: 'auto',
              background: colorBgContainer,
            }}
          >
            <AIImageDesign />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Design;