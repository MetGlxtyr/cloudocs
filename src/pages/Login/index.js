import { Card, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store';
import logo from '@/assets/logo.svg';
import './index.scss'

export default function Login() {
  const { loginStore } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await loginStore.logIn(values);
      navigate('/article', { replace: true });
      message.success('登录成功');
    } catch (err) {
      message.error(err.response?.data.message || '帐号或密码错误');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  return (
    <div className='login'>
      <Card className='login-container'>
        <img className='login-logo' src={logo} alt='LOGO' />
        <Form
          name="login-form"
          className="login-form"
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="tel"
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
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="手机号"
            />
          </Form.Item>
          <Form.Item
            name="pass"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="/agreement" target="_blank">
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              size="large" type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            没有帐户？ <a href="/signup">注册</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
};
