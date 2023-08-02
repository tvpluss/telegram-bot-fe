import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Layout,
  List,
  Menu,
  Row,
  Skeleton,
  Typography,
  message,
} from "antd";
import Link from "antd/es/typography/Link";
import YouTube from "react-youtube";
const { Header, Content } = Layout;
interface IVideoMetaData {
  name?: string;
  videoId?: string;
  loading?: boolean;
}
const youtubeVideos: Array<IVideoMetaData> = [
  {
    name: "Tay Trái Chỉ Trăng ",
    videoId: "ATPulcGQ2SE",
  },
  {
    name: "Ngày ấy",
    videoId: "aWNu0BHuHws",
  },
  {
    name: "You will always...",
    videoId: "xpHmDZfg6z4",
  },
];

const App: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [list, setList] = useState<IVideoMetaData[]>([]);
  const [curVideo, setCurVideo] = useState<IVideoMetaData>({});
  useEffect(() => {
    setInitLoading(false);
    setList(youtubeVideos.slice(1));
    setCurVideo(youtubeVideos[0]);
    setVideoLoading(false);
  }, []);

  const handleLoadMore = () => {
    setLoading(true);
    setList((prevList) => [...prevList, ...youtubeVideos]);
    setLoading(false);
    // return false
    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    // In real scene, you can using public method of react-virtualized:
    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    window.dispatchEvent(new Event("resize"));
    return true;
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
        <Button onClick={handleLoadMore}>loading more</Button>
      </div>
    ) : null;
  const changeVideo = async () => {
    try {
      if (list.length == 0) {
        message.info(`Đã hết video trong queue`);
        return;
      }
      setVideoLoading(true);
      setCurVideo(list[0]);
      setList(list.slice(1));
      setVideoLoading(false);
      message.info(`Kết thúc video`);
    } catch (error) {
      message.error(`Lỗi khi chuyển video:`);
    }
  };
  const handleVideoError = async (error: any) => {
    message.error(`Lỗi của video: ${error}`);
    await changeVideo();
  };
  const handleVideoEnded = async () => {
    await changeVideo();
  };
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
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
        <Typography.Title type="success" level={1}>
          Auto Videos Player
        </Typography.Title>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 20px", minHeight: "100vh" }}
      >
        <Row gutter={10}>
          <Col flex={2}>
            <Typography.Title level={2}>Current Video</Typography.Title>
            <Skeleton active loading={videoLoading}>
              <YouTube
                videoId={curVideo.videoId}
                opts={opts}
                onEnd={handleVideoEnded}
                onError={handleVideoError}
              />
            </Skeleton>
          </Col>
          <Col flex={1}>
            <Typography.Title level={2}>Requested</Typography.Title>
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
                    description={<Link>{item.videoId}</Link>}
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
