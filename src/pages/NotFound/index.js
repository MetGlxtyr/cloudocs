import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry，页面好像不存在~"
      extra={<Button type="primary" onClick={() =>
        navigate('/article', { replace: true })}>返回首页</Button>}
    />)
}