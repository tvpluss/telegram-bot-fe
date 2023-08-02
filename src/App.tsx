import React, { useEffect, useState } from "react";
import { Avatar, Button, Col, Layout, List, Menu, Row, Skeleton } from "antd";
import Link from "antd/es/typography/Link";

const { Header, Content } = Layout;
interface IVideoMetaData {
  name?: string;
  url?: string;
  loading?: boolean;
}
const youtubeVideos: IVideoMetaData[] = [
  {
    name: "Tay Trái Chỉ Trăng ",
    url: "https://www.youtube.com/watch?v=ATPulcGQ2SE",
  },
  {
    name: "Ngày ấy",
    url: "https://www.youtube.com/watch?v=aWNu0BHuHws",
  },
  {
    name: "You will always...",
    url: "https://www.youtube.com/watch?v=xpHmDZfg6z4",
  },
];
const count = 3;

const App: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IVideoMetaData[]>([]);
  const [list, setList] = useState<IVideoMetaData[]>([]);
  useEffect(() => {
    setInitLoading(false);
    setData(youtubeVideos);
    setList(youtubeVideos);
  }, []);
  const onLoadMore = () => {
    setLoading(true);
    setList(data.concat([...new Array(count)].map(() => ({}))));
    const newData = data.concat(youtubeVideos);
    setData(newData);
    setList(newData);
    setLoading(false);
    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    // In real scene, you can using public method of react-virtualized:
    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    window.dispatchEvent(new Event("resize"));
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;
  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={new Array(3).fill(null).map((_, index) => ({
            key: String(index + 1),
            label: `nav ${index + 1}`,
          }))}
        />
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 20px", minHeight: "100vh" }}
      >
        <Row gutter={10}>
          <Col flex={2}>
            <iframe
              src="https://www.youtube.com/embed/E7wJTI-1dvQ"
              allow="autoplay; encrypted-media"
              title="video"
              allowFullScreen
              style={{
                minWidth: "800",
                minHeight: "600",
              }}
            />
          </Col>
          <Col flex={1}>
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a key="list-loadmore-edit">edit</a>,
                    <a key="list-loadmore-more">more</a>,
                  ]}
                >
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={<Link>{item.url}</Link>}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default App;
