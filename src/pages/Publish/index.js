import React, { useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import ReactQuill from 'react-quill';
import { http } from '@/utils';
import qs from 'qs';

import 'react-quill/dist/quill.snow.css'
import './index.scss'

export default function Publish() {
  const form = useRef(null);

  const [params] = useSearchParams();
  const articleId = params.get('id');

  async function getDoc() {
    const res = await http.get(`/docs/${articleId}`);
    const { content, doc } = res.data
    form.current.setFieldsValue({ title: doc.title, content: content });
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
      await http.put(`/docs/${articleId}`, qs.stringify({ ...values }));
    } else {
      await http.post(`/docs`, qs.stringify({ ...values }));
    }
    navigate('/article');
    message.success('上传成功')
  };

  return (
    <>
      <Form
        onFinish={upload}
        ref={form}
      >
        <Form.Item label="标题">
          <Form.Item
            name="title"
            style={{ display: 'inline-block' }}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>

          <Form.Item
            style={{
              display: 'inline-block',
              margin: '0 10px'
            }}
          >
            <Button type='primary' htmlType='submit'>{articleId ? '更新' : '新建'}</Button>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="内容"
          name="content"
        >
          <ReactQuill
            className="publish-quill"
            theme="snow"
            placeholder="请输入文章内容"
          />
        </Form.Item>
      </Form>
    </>
  );
};