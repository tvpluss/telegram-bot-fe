import React, { useEffect, useState } from "react";
import { Col, Layout, List, Row, Skeleton, Typography, message } from "antd";
import Link from "antd/es/typography/Link";
import YouTube, { YouTubeEvent } from "react-youtube";
import axios from "axios";
import { BACKEND_URL } from "./constants";
const { Header, Content } = Layout;
const App: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [list, setList] = useState([]);
  const [curVideo, setCurVideo] = useState("");
  const getNextVideoId = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/play`);
      if (res.data.video) {
        const url = new URL(res.data.video);
        console.log({ url });
        return url.searchParams.get("v");
      }
    } catch (error) {
      message.error(`Hết bài rồi`);
    }
  };
  const getPendingVideoIds = async () => {
    const res = await axios.get(`${BACKEND_URL}/videos`);
    return res.data.videos.map((video: string) => {
      const url = new URL(video);
      return url.searchParams.get("v");
    });
  };
  useEffect(() => {
    setInitLoading(false);
    setVideoLoading(true);
    const fetchData = async () => {
      const nextVideo = await getNextVideoId();
      const pendingVideos = await getPendingVideoIds();
      if (nextVideo) {
        setCurVideo(nextVideo);
        setList(pendingVideos);
      } else {
        message.info(`Hết bài hát rồi`, 10);
      }
    };

    fetchData();
    setVideoLoading(false);
  }, []);

  const changeVideo = async () => {
    try {
      setVideoLoading(true);
      const nextVideo = await getNextVideoId();
      const pendingVideos = await getPendingVideoIds();
      if (nextVideo) {
        setCurVideo(nextVideo);
        setList(pendingVideos);
      } else {
        message.info(`Hết bài hát rồi`);
      }
      setVideoLoading(false);
      message.info(`Kết thúc video, chuyển bài...`);
    } catch (error) {
      message.error(`Lỗi khi chuyển video:`);
    }
  };
  const handleVideoError = async (error: YouTubeEvent<number>) => {
    message.error(`Lỗi của video: ${JSON.stringify(error.target)}`);
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
                videoId={curVideo}
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
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a key="list-loadmore-edit">edit</a>,
                    <a key="list-loadmore-more">more</a>,
                  ]}
                >
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item}</a>}
                    description={<Link>{item}</Link>}
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
