import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Form, Input, message, Space, Popover, Popconfirm } from 'antd';
import Share from '@/components/Share';
import useStore from '@/store';
import { http, getUser } from '@/utils';
import ReactQuill from 'react-quill';
import qs from 'qs';

import 'react-quill/dist/quill.snow.css';
import './index.scss';


const modules = {
  toolbar: [
    [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
    [ { 'font': [] } ],
    [ 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code' ],
    [ { 'color': [] }, { 'background': [] } ],
    [ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' } ],
    [ { 'align': [] } ],
    [ 'link', 'image' ],
    [ 'clean' ]
  ],
}

const formats = [
  'header', 'font',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code',
  'color', 'background',
  'list', 'bullet', 'indent',
  'align', 'link', 'image'
]

export default function Publish() {
  const form = useRef(null);
  const [ creator, setCreator ] = useState();
  const [ visible, setVisible ] = useState(false);
  const [ shareList, setShareList ] = useState([]);

  const [ params ] = useSearchParams();
  const articleId = params.get('id');
  const { docsStore } = useStore();

  const list = (
    <Space direction="vertical" style={{ display: 'flex' }}>
      {
        shareList.length ?
          shareList.map(item =>
            <div className='share-item' key={item.tel}>
              <Avatar>{item.name[ 0 ]}</Avatar>
              <span style={{ margin: '0 8px' }}>{item.name}</span>
              <Popconfirm
                title="确认移除?"
                onConfirm={() => unShare(item.tel)}
                okText="确认"
                cancelText="取消"
              >
                <Button danger>移除</Button>
              </Popconfirm>
            </div>) : <div>还没分享~</div>}
    </Space>
  )

  async function getDoc() {
    const res = await http.get(`/docs/${ articleId }`);
    const { content, doc } = res.data;
    setCreator(doc.creator);
    form.current.setFieldsValue({ title: doc.title, content: content });
  }

  async function onShare(values) {
    const res = await http.put(`/docs/share/${ articleId }`, qs.stringify(values));
    if (res) {
      setVisible(false);
      message.success('分享成功');
    } else {
      message.error('用户不存在');
    }
  }

  async function unShare(tel) {
    await http.delete(`/docs/share/${ articleId }`, { params: { tel } });
    setShareList(shareList.filter(item => item.tel !== tel));
  }

  useEffect(() => {
    if (articleId) {
      getDoc();
    }
  })

  const navigate = useNavigate();
  const upload = async (values) => {
    if (!values.title) {
      values.title = '无标题文档';
    }
    if (articleId) {
      await http.put(`/docs/${ articleId }`, qs.stringify({ ...values }));
    } else {
      await http.post(`/docs`, qs.stringify({ ...values }));
    }
    docsStore.getDocsList();
    navigate('/article');
    message.success('上传成功');
  };

  return (
    <>
      <Form
        onFinish={upload}
        ref={form}
      >
        <div style={{ margin: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            name="title"
            style={{ display: 'inline-block', margin: '0', flex: '1' }}
          >
            <Input className='title' placeholder="请输入文章标题" />
          </Form.Item>

          <Space size='middle'>
            <Button type='primary' size='large' htmlType='submit'>{articleId ? '更新' : '新建'}</Button>
            {articleId && creator === getUser() && <Button
              size='large'
              htmlType='button'
              onClick={() => {
                setVisible(true);
              }}>分享</Button>}
            {articleId && creator === getUser() &&
              <Popover placement='bottomRight' content={list} trigger='click'>
                <Button htmlType='button'
                  size='large'
                  onClick={async () => {
                    const res = await http.get(`/docs/share/${ articleId }`);
                    setShareList(res.data.users);
                  }}>谁可以看</Button>
              </Popover>
            }
          </Space>
        </div>
        <Form.Item
          name="content"
        >
          <ReactQuill
            className="publish-quill"
            theme="snow"
            placeholder="请输入文章内容"
            style={{ whiteSpace: 'pre-wrap' }}
            modules={modules}
            formats={formats}
          />
        </Form.Item>
      </Form>

      <Share
        visible={visible}
        onShare={onShare}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};