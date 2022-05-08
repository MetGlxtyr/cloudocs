import { Form, Input, Select, Checkbox, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store';
import './index.scss'
import logo from '@/assets/logo.svg';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12.,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

export default function RegistrationForm() {
  const { registerStore } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await registerStore.signUp(values);
      navigate('/', { replace: true });
      message.success('注册成功');
    } catch (err) {
      message.error(err.response?.data.message || '注册失败');
    }
  };

  return (
    <div className='register'>

      <Card className='register-container'>
        <img className='register-logo' src={logo} alt='LOGO' />
        <Form
          {...formItemLayout}
          name="register"
          validateTrigger={[ 'onBlur', 'onChange' ]}
          onFinish={onFinish}
          scrollToFirstError
        >

          <Form.Item
            name="tel"
            label="手机号码"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对！',
                validateTrigger: 'onBlur'
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="pass"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
              {
                message: '密码长度为6~16',
                min: 6,
                max: 16
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={[ 'pass' ]}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入密码！',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('pass') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="name"
            label="昵称"
            rules={[
              {
                required: true,
                message: '请输入昵称！',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[
              {
                required: true,
                message: '请选择性别！',
              },
            ]}
          >
            <Select placeholder="请选择您的性别">
              <Option value="1">男</Option>
              <Option value="2">女</Option>
              <Option value="0">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                type: 'email',
                message: '邮箱不合法！',
              },
              {
                required: false,
                message: '请输入邮箱！',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请勾选协议')),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              完成注册即表示同意我们的<a href="/agreement" target="_blank">用户协议</a>
            </Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" className="register-form-button">
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};