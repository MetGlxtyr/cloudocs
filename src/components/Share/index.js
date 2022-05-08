import { Form, Input, Modal } from 'antd';
export default function Share({ visible, onShare, onCancel }) {
  const [ form ] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="想分享给谁?"
      okText="分享"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onShare(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="tel"
          label="TA的电话号码"
          rules={[
            {
              required: true,
              message: '请输入电话号码!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

