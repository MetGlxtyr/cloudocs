import { useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm, ConfigProvider, message } from 'antd';
import { EditOutlined, DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import Share from '@/components/Share';
import useStore from '@/store';
import { http, history } from '@/utils';
import zhCN from 'antd/lib/locale/zh_CN';
import qs from 'qs';

import './index.scss'

function Article() {
  const [ visible, setVisible ] = useState(false);
  const [ shareId, setShareId ] = useState();
  const [ params, setParams ] = useState({
    page: 1,
    per_page: 20
  })

  const { userStore, docsStore } = useStore();

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '创建者',
      dataIndex: 'creator_name',
      width: 220
    },
    {
      title: '发布时间',
      dataIndex: 'ctime',
      sortDirections: [ 'ascend', 'descend', 'ascend' ],
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.created - b.created
    },
    {
      title: '最近修改',
      dataIndex: 'ltime',
      sorter: (a, b) => a.last - b.last
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => history.push(`/publish?id=${ data._id }`)}
            />
            {

              <Popconfirm
                title="确定删除这篇文档吗?"
                onConfirm={() => delArticle(data)}
                okText="确认"
                cancelText="取消"
                disabled={userStore.userInfo._id !== data.creator}
              >
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  disabled={userStore.userInfo._id !== data.creator}
                />
              </Popconfirm>}
            <Button
              shape="circle"
              icon={<ShareAltOutlined />}
              onClick={() => {
                setShareId(data._id);
                setVisible(true);
              }}
              disabled={userStore.userInfo._id !== data.creator}
            />
          </Space>
        )
      }
    }
  ]

  async function onShare(values) {
    const res = await http.put(`/docs/share/${ shareId }`, qs.stringify(values));
    if (res) {
      setVisible(false);
      message.success('分享成功');
    } else {
      message.error('用户不存在');
    }
  }

  useEffect(() => {
    docsStore.docsList.length || docsStore.getDocsList();
  }, [ docsStore ])

  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  const delArticle = async (data) => {
    await http.delete(`/docs/${ data._id }`);
    docsStore.delDoc(data._id);
  }

  return (
    <div>
      <ConfigProvider locale={zhCN}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={docsStore.docsList}
          pagination={{
            position: [ 'bottomCenter' ],
            current: params.page,
            pageSize: params.per_page,
            onChange: pageChange
          }}
        />
        <Share
          visible={visible}
          onShare={onShare}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </ConfigProvider>
    </div >
  )
};

export default observer(Article)