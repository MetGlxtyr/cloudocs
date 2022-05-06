import { useState, useEffect } from 'react';
import { Button, Card, Form, Select, Table, Space, Popconfirm, ConfigProvider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import { http, history } from '@/utils';
import './index.scss'

const { Option } = Select;

export default function Article() {

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
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.created - b.created
    },
    {
      title: '操作',
      render: data => {
        console.log(data);
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => history.push(`/publish?id=${data._id}`)}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const [docs, setdocs] = useState([])

  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })

  async function fetchDocsList() {
    const res = await http.get('/docs');
    const docs = res.data.docs;
    if (docs) {
      docs.forEach(async element => {
        element.ctime = moment(element.created * 1000).format('M月D日 HH:mm');
      });
    }
    setdocs(docs);
  }

  useEffect(() => {
    fetchDocsList();
  }, [params])

  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  const delArticle = async (data) => {
    await http.delete(`/docs/${data._id}`);
    setParams({
      page: 1,
      per_page: 10
    })
  }

  return (
    <div>
      <ConfigProvider locale={zhCN}>
        <Card
          title={'最近'}
        >
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={docs}
            pagination={{
              position: ['bottomCenter'],
              current: params.page,
              pageSize: params.per_page,
              onChange: pageChange
            }}
          />
        </Card>
      </ConfigProvider>
    </div >
  )
};
