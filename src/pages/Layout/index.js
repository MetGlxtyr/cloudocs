import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Menu, Popconfirm, BackTop } from 'antd';
import { HomeFilled, FileFilled, EditFilled, LogoutOutlined } from '@ant-design/icons';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useStore from '@/store';
import { setUser } from '@/utils';
import './index.scss'

const { Header, Content, Footer, Sider } = Layout;

function CloudocsLayout() {
  const [ collapsed, setCollapsed ] = useState(false);
  const [ publishAccess, enablePublish ] = useState(true);
  const { pathname } = useLocation();

  const { userStore, loginStore, docsStore } = useStore()

  const navigate = useNavigate();
  const onLogout = () => {
    loginStore.logOut();
    docsStore.clearDocsList();
    navigate('/login');
  }

  const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  };

  useEffect(() => {
    try {
      userStore.getUserInfo();
    } catch (err) { }
  }, [ userStore ])

  useEffect(() => {
    if (userStore.userInfo._id) {
      setUser(userStore.userInfo._id)
    }
  })

  const items = [
    {
      label: <Link to="/">主页</Link>,
      icon: <HomeFilled />,
      key: '/'
    },
    {
      label: <Link to="/article">文档</Link>,
      icon: <FileFilled />,
      key: '/article'
    },
    {
      label: publishAccess ? <Link to="/publish">编辑</Link> : <div>编辑</div>,
      icon: <EditFilled />,
      key: '/publish',
    }
  ]

  return (
    <Layout>
      <BackTop visibilityHeight={300} >
        <div style={style}>UP</div>
      </BackTop>
      <Sider
        className='sider'
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => setCollapsed(collapsed)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[ pathname ]}
          items={items}
          onSelect={(item) => {
            if (item.key !== '/publish') enablePublish(true);
            else enablePublish(false);
          }}
        />
      </Sider>
      <Layout
        style={collapsed ? null : {
          marginLeft: 200,
        }}
      >
        <Header className="site-layout-sub-header-background" style={{ position: 'sticky', top: 0, padding: 0 }} >
          <div className="user-info">
            <span className="user-name">{userStore.userInfo.name}</span>
            <span className="user-logout">
              <Popconfirm title="确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
                <LogoutOutlined /> 退出
              </Popconfirm>
            </span>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2022 Cloudocs from NEU</Footer>
      </Layout>
    </Layout >
  )
}

export default observer(CloudocsLayout)