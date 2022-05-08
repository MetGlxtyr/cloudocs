import { useEffect } from 'react';
import HeatMap from '@/components/HeatMap';
import { List, Card, Typography } from 'antd';
import useStore from '@/store';
import { observer } from 'mobx-react-lite';
import { history } from '@/utils';
import './index.scss'

function Home() {

  const { docsStore } = useStore();

  useEffect(() => {
    docsStore.docsList.length || docsStore.getDocsList();
  }, [ docsStore ])

  return (
    <div>
      <HeatMap
        style={{ width: '100%', height: '300px' }}
        data={docsStore.docsList}
      />
      <Card title='最近'>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 4,
            xxl: 5,
          }}
          dataSource={docsStore.docsList.slice(-3).reverse()}
          renderItem={item => (
            <List.Item>
              <Card
                className='docsCard'
                style={{ cursor: 'pointer' }}
                onClick={() => history.push(`/publish?id=${ item._id }`)}
                title={
                  <Typography.Title ellipsis copyable level={5}>
                    {item.title}
                  </Typography.Title>
                }
              >
                <span style={{ color: '#1890ff' }}> {item.creator_name}</span>
                {` 创建于${ item.ctime }`}

              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>);
};

export default observer(Home)