import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Button, message, Slider, Row, Col, Menu, Tooltip, Popover, Dropdown, Spin, Divider } from 'antd';
import {
    FullscreenOutlined, CloseOutlined, CaretRightFilled, PauseOutlined, ReloadOutlined, PlayCircleFilled,
    Loading3QuartersOutlined, FrownOutlined, BackwardOutlined, StepForwardOutlined, FullscreenExitOutlined, RetweetOutlined, LinkOutlined,
    FileTextFilled, SettingFilled, CheckOutlined, InfoCircleOutlined, QuestionCircleOutlined, 
} from '@ant-design/icons';
import Slide from 'react-reveal/Slide';
import Mute from '@/elements/icon/mute';
import SmallVolume from '@/elements/icon/smallVolume';
import Volume from '@/elements/icon/volume';
import Caption from '@/elements/icon/caption';
import { videoRates as rates, videoResolutions as resolutions, videoCaptions as captions } from '@/config/constants';
import { secondsToTime } from '@/utils/utils';
import styles from './default.less';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Video = ({ videoUrl, baseWidth, baseHeight, ...props }) => {
    const divRef = useRef(null);
    const videoRef = useRef(null);
    const previewRef = useRef(null);
    const [srcObj, setSrcObj] = useState(null); 
    const [fullScreen, setFullScreen] = useState(false);
    const [loop, setLoop] = useState(false);
    const [controlVisible, setControlVisible] = useState(false);
    const [duration, setDuration] = useState(null);
    const [currentTime, setCurrentTime] = useState({
        changing: false,
        value: 0
    });
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [bufferTime, setBufferTime] = useState(0);
    const [playingStatus, setPlayingStatus] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState({
        status: 0,
        text: ''
    });
    const [preview, setPreview] = useState({
        visible: false,
        time: 0,
        left: 0,
        bottom: 0
    });
    const [previewWidth, setPreviewWidth] = useState(0);
    const [previewHeight, setPreviewHeight] = useState(0);
    const [volume, setVolume] = useState(0);
    const [oldVolume, setOldVolume] = useState(0);
    const [volumeVisible, setVolumeVisible] = useState(false);
    const [playbackRate, setPlaybackRate] = useState("1.0");
    const [curOpenKeys, setOpenKeys] = useState([]);
    const [resolution, setResolution] = useState('720');
    const [caption, setCaption] = useState('eng');
    const [settingsVisible, setSettingsVisible] = useState(false);
    useEffect(() => {
        if (videoRef.current) {
            const videoEle = videoRef.current;
            videoEle.ondurationchange = () => setDuration(videoEle.duration);
            videoEle.onloadedmetadata = () => {
                const videoHeight = videoEle.videoHeight;
                const videoWidth = videoEle.videoWidth;
                let realHeight, realWidth, realPreviewHeight, realPreviewWidth;
                if (videoWidth / videoHeight < 4 / 3) {
                    realHeight = baseHeight;
                    realWidth = (baseHeight / videoHeight) * videoWidth;
                    realPreviewHeight = 84;
                    realPreviewWidth = (84 / videoHeight) * videoWidth;
                }
                else {
                    const divEle = divRef.current;
                    if (divEle) {
                        const divWidth = divEle.clientWidth;
                        realWidth = divWidth;
                        realHeight = (realWidth / videoWidth) * videoHeight;
                        realPreviewWidth = 160;
                        realPreviewHeight = (realPreviewWidth / videoWidth) * videoHeight;
                    }
                }
                setPreviewWidth(realPreviewWidth);
                setPreviewHeight(realPreviewHeight);
                setWidth(realWidth);
                setHeight(realHeight);
            };
            videoEle.onloadeddata = () => {
                setPlayingStatus(videoEle.autoplay ? 0 : 1);
                setVolume(videoEle.volume);
                if (videoEle.volume === 0) setOldVolume(1); else setOldVolume(videoEle.volume);

            };
            videoEle.onprogress = () => {
                let buffer = 0;
                for (let i = 0; i < videoEle.buffered.length; i++) {
                    if (videoEle.buffered.start(videoEle.buffered.length - 1 - i) <= videoEle.currentTime) {
                        buffer = videoEle.buffered.end(videoEle.buffered.length - 1 - i);
                        setBufferTime(buffer);
                        return;
                    }
                } 
            };
            videoEle.oncanplay = () => {
                setError({
                    status: 0,
                    text: ''
                });
            };
            videoEle.ontimeupdate = () => {
                setCurrentTime(prevState => {
                    if (prevState.changing) return { ...prevState };
                    return {
                        changing: false,
                        value: videoEle.currentTime
                    };
                })
            }
            videoEle.onwaiting = () => setWaiting(true);
            videoEle.onplaying = () => setWaiting(false);
            videoEle.onplay = () => setPlayingStatus(0);
            videoEle.onpause = () => setPlayingStatus(1);
            videoEle.onended = () => setPlayingStatus(2);
            videoEle.onerror = () => handleError('Sorry, there was an error');
            videoEle.onstalled = () => handleError('Sorry, the video is not available.');
            videoEle.onabort = () => handleError('Sorry, the video is stoped downloading.');
            return () => {
                videoEle.ondurationchange = null;
                videoEle.onloadeddata = null;
                videoEle.onloadedmetadata = null;
                videoEle.onprogress = null;
                videoEle.oncanplay = null;
                videoEle.ontimeupdate = null;
                videoEle.onwaiting = null;
                videoEle.onplaying = null;
                videoEle.onplay = null;
                videoEle.onpause = null;
                videoEle.onended = null;
                videoEle.onerror = null;
                videoEle.onstalled = null;
                videoEle.onabort = null;
            };
        }
    }, []);
    useEffect(() => {
        const fullscreenFn = e => setFullScreen(!!document.fullscreenElement);
        const webkitFullScreenFn = e => setFullScreen(!!document.webkitFullscreenElement);
        const mozFullscreenFn = e => setFullScreen(!!document.mozFullscreenElement);
        const msFullscreenFn = e => setFullScreen(!!document.msFullscreenElement);
        document.addEventListener('fullscreenchange', fullscreenFn, false);
        document.addEventListener('webkitfullscreenchange', webkitFullScreenFn, false);
        document.addEventListener('mozfullscreenchange', mozFullscreenFn, false);
        document.addEventListener('msfullscreenchange', msFullscreenFn, false);
        return () => {
            document.removeEventListener('fullscreenchange', fullscreenFn);
            document.removeEventListener('webkitfullscreenchange', webkitFullScreenFn);
            document.removeEventListener('mozfullscreenchange', mozFullscreenFn);
            document.removeEventListener('msfullscreenchange', msFullscreenFn);
        };
    }, []);
    useEffect(() => {
        setSrcObj(videoUrl);
        return () => {
            setBufferTime(0);
            setWidth(0);
            setHeight(0);
            setPlaybackRate('1.0');
            setSrcObj(null);
        };
    }, [videoUrl]);
    const handleError = messageText => {
        setError({
            status: 1,
            text: messageText
        });
        setWidth(prevWidth => prevWidth === 0 ? '100%' : prevWidth);
        setHeight(prevHeight => prevHeight === 0 ? 525 : prevHeight);
    };
    const handleTogglePlay = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            if (playingStatus === 0) videoEle.pause();
            else if (playingStatus === 2) {
                setCurrentTime({
                    changing: false,
                    value: 0
                });
                videoEle.play();
            }
            else videoEle.play();
        }
    };
    const handleChangeCurrentTime = value => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.currentTime = value;
            setCurrentTime({
                changing: false,
                value
            });
        }
    };
    const handleMouseOnSlider = e => {
        const offsetX = e.nativeEvent.offsetX;
        const sliderWidth = divRef.current.clientWidth - 24;
        const time = (offsetX / sliderWidth) * duration;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const left = clientX - 82;
        const bottom = window.innerHeight - clientY + 16;
        previewRef.current.currentTime = time;
        setPreview({
            visible: true,
            time,
            left,
            bottom
        });
    };
    const resetPreview = () => {
        setPreview({
            visible: false,
            time: 0,
            left: 0,
            bottom: 0
        });
    };
    const handlePlayBack = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.currentTime = videoEle.currentTime - 15;
            if (videoEle.pause) videoEle.play();
        }
    };
    const handlePlayForward = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.currentTime = videoEle.currentTime + 15;
            if (videoEle.pause) videoEle.play();
        }
    };
    const handleSetVolume = value => {
        const videoEle = videoRef.current;
        if (videoEle) {
            videoEle.volume = value;
            if (value > 0) setOldVolume(value);
        }
    };
    const handleToggleVolume = () => {
        const videoEle = videoRef.current;
        if (videoEle) {
            if (volume > 0) {
                setVolume(0);
                videoEle.volume = 0;
            }
            else {
                setVolume(oldVolume);
                videoEle.volume = oldVolume;
            }
        }
    };
    const handleToggleExpand = () => {
        const divEle = divRef.current;
        if (!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement)) {
            if (divEle.requestFullscreen) {
                divEle.requestFullscreen()
                    .catch(err => message.error(`Error attempting to enable full-screen mode: ${err.message}`));
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                    .catch(err => message.error(`Error attempting to exit full-screen mode: ${err.message}`));
                
            }
        }
    };
    const handleOpenKeysChange = openKeys => {
        const latestOpenKey = _.find(openKeys, key => _.indexOf(curOpenKeys, key) === -1);
        if (_.indexOf(['resolution', 'rate', 'caption'], latestOpenKey) === -1) {
            setOpenKeys(openKeys);
        }
        else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    const handleSelectSetting = ({ key }) => {
        const submenu = curOpenKeys[0];
        if (submenu === 'resolution') {
            setResolution(key);
        }
        else if (submenu === 'rate') {
            const videoEle = videoRef.current;
            if (videoEle) {
                videoEle.playbackRate = _.toNumber(key);
                setPlaybackRate(key);
            }
        }
        else if (submenu === 'caption') {
            setCaption(key);
        }
    };
    const handleSettingsVisibleChange = visible => {
        if (!visible) setOpenKeys([]);
        setSettingsVisible(visible);
    };
    const handleSelectOption = ({ key }) => {
        console.log(key);
        if (key === "loop") {
            setLoop(!loop);
        }
    };
    const settingsMenu = (
        <Menu
            mode="inline"
            className={styles.menu}
            openKeys={curOpenKeys}
            onOpenChange={handleOpenKeysChange}
            multiple
            selectedKeys={[resolution, playbackRate, caption]}
            onSelect={handleSelectSetting}
            style={{
                height: _.size(curOpenKeys) > 0 ? '250px' : '151px'
            }}
        >
            <SubMenu key="resolution" title={`Resolution [${resolutions[resolution]}]`}>
                {_.map(_.orderBy(_.keys(resolutions), key => key, ['desc']), resolutionKey => (
                    <MenuItem key={resolutionKey} >
                        {resolutions[resolutionKey]}
                        {resolutionKey === resolution && (<CheckOutlined style={{ marginLeft: '5px', color: '#090199', fontSize: '0.85em' }}/>)}
                    </MenuItem>
                ))}
            </SubMenu>
            <Menu.Divider />
            <SubMenu key="rate" title={`Playback rate [${rates[playbackRate]}]`}>
                {_.map(_.keys(rates), rateKey => (
                    <MenuItem key={rateKey}>
                        {rates[rateKey]}
                        {rateKey === playbackRate && (<CheckOutlined style={{ marginLeft: '5px', color: '#090199', fontSize: '0.85em' }}/>)}
                    </MenuItem>
                ))}
            </SubMenu>
            <Menu.Divider />
            <SubMenu key="caption" title={`Captions [${captions[caption]}]`}>
                {_.map(_.keys(captions), captionKey => (
                    <MenuItem key={captionKey}>
                        {captions[captionKey]}
                        {captionKey === caption && (<CheckOutlined style={{ marginLeft: '5px', color: '#090199', fontSize: '0.85em' }}/>)}
                    </MenuItem>
                ))}
            </SubMenu>
        </Menu>
    );
    const dropdownMenu = (
        <Menu className={styles.dropdownMenu} selectedKeys={[]} onClick={handleSelectOption}>
            <MenuItem key="loop">
                <RetweetOutlined />Loop
                {loop && (
                    <span className={styles.loopOk}>
                        <CheckOutlined />
                    </span>
                )}
            </MenuItem>
            <MenuItem key="copy">
                <LinkOutlined />Copy URL video
            </MenuItem>
            <MenuItem key="help">
                <QuestionCircleOutlined />Help center
            </MenuItem>
            <MenuItem key="info">
                <InfoCircleOutlined />Information detail
            </MenuItem>
        </Menu>
    );
    return  (
        <React.Fragment>
            {(width === 0 || height === 0) && (
                <div className={styles.fetching}>
                    <Spin size="large" />
                </div>
            )}
            <div
                className={styles.defaultVideo}
                ref={divRef} style={{ height: height, width: baseWidth }}
                onMouseEnter={() => setControlVisible(true)}
                onMouseLeave={() => setControlVisible(false)}
            >
                <Dropdown overlay={dropdownMenu} trigger={['contextMenu']} overlayClassName={styles.contextDropdown} getPopupContainer={() => divRef.current}>
                    <video
                        {...props}
                        ref={videoRef}
                        src={srcObj}
                        className={styles.videoEle}
                        width={!fullScreen ? width : '100%'}
                        height={!fullScreen ? height : '100%'}
                        onClick={handleTogglePlay}
                        loop={loop}
                        controlsList="nodownload"
                        onContextMenu={e => {
                            e.preventDefault();
                            return false;
                        }}
                        
                    />
                </Dropdown>
                {width > 0 && height > 0 && (
                    <>
                        {true && (
                            <Slide bottom duration={200}>
                                <div className={styles.controlBarOuter}>
                                    <div className={styles.controlBar}>
                                        <Row gutter={8}>
                                            <Col className={styles.playStatus} span={2}>
                                                <div className={styles.val} onClick={handleTogglePlay}>
                                                    {playingStatus === 1 ? (
                                                        <Tooltip placement="top" title="Play" getPopupContainer={() => divRef.current}>
                                                            <CaretRightFilled />
                                                        </Tooltip>
                                                    ) : playingStatus === 0 ? (
                                                        <Tooltip placement="top" title="Pause" getPopupContainer={() => divRef.current}>
                                                            <PauseOutlined />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip placement="top" title="Reload" getPopupContainer={() => divRef.current}>
                                                            <ReloadOutlined />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col className={styles.center} span={16}>
                                                {/* <Divider type="vertical" /> */}
                                                <Row gutter={8}>
                                                    <Col className={styles.playbackRate} span={2}>
                                                        <div>
                                                            <Tooltip placement="top" title="Playback rate" getPopupContainer={() => divRef.current}>
                                                                <span className={styles.val}>
                                                                    1.0x
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </Col>
                                                    <Col className={styles.currentTime} span={3}>
                                                        <span className={styles.val}>
                                                            {secondsToTime(currentTime.value)}
                                                        </span>
                                                    </Col>
                                                    <Col className={styles.sliderCol} span={14}>
                                                        <div className={styles.slider} onMouseMove={handleMouseOnSlider} onMouseLeave={resetPreview}>
                                                            <Slider
                                                                min={0}
                                                                max={_.round(duration, 1)}
                                                                step={0.1}
                                                                value={currentTime.value}
                                                                onChange={value => {
                                                                    setCurrentTime({
                                                                        value,
                                                                        changing: true
                                                                    });
                                                                }}
                                                                onAfterChange={handleChangeCurrentTime}
                                                                tooltipVisible={false}
                                                            />
                                                            <span className={styles.buffered} style={{ width: `${(bufferTime * 100) / duration}%` }}/>
                                                        </div>
                                                    </Col>
                                                    <Col className={styles.endTime} span={3}>
                                                        <span className={styles.val}>
                                                            {secondsToTime(duration)}
                                                        </span>
                                                    </Col>
                                                    <Col className={styles.forward} span={2}>
                                                        <Tooltip placement="top" title="Forward 15s">
                                                            <StepForwardOutlined />
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                                {/* <Divider type="vertical" /> */}
                                            </Col>
                                            <Col className={styles.options} span={6}>
                                                <Row>
                                                    <Col span={8} className={styles.transcript}>
                                                        <Tooltip title="Transcript" placement="top">
                                                            <FileTextFilled />
                                                        </Tooltip>
                                                    </Col>
                                                    <Col span={8} className={styles.subtitles}>
                                                        <Tooltip placement="top" title="Subtitles">
                                                            <Caption />
                                                        </Tooltip>
                                                    </Col>
                                                    <Col span={8} className={styles.subtitles}>
                                                        <Tooltip placement="top" title="Setting">
                                                            <SettingFilled />
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                {/* <div className={styles.controlVisible}>
                                    <div>
                                        <div className={styles.slider} onMouseMove={handleMouseOnSlider} onMouseLeave={resetPreview}>
                                            <Slider
                                                min={0}
                                                max={_.round(duration, 1)}
                                                step={0.1}
                                                value={currentTime.value}
                                                onChange={value => {
                                                    setCurrentTime({
                                                        value,
                                                        changing: true
                                                    });
                                                }}
                                                onAfterChange={handleChangeCurrentTime}
                                                tooltipVisible={false}
                                            />
                                            <span className={styles.buffered} style={{ width: `${(bufferTime * 100) / duration}%` }}/>
                                        </div>
                                        <Row className={styles.options}>
                                            <Col span={12} className={styles.left}>
                                                <span className={styles.back} onClick={handlePlayBack}>
                                                    <Tooltip placement="top" title="Back 15s">
                                                        <BackwardOutlined />
                                                    </Tooltip>  
                                                </span>
                                                <span className={styles.playStatus} onClick={handleTogglePlay}>
                                                    {playingStatus === 1 ? (
                                                        <Tooltip placement="top" title="Play">
                                                            <CaretRightFilled />
                                                        </Tooltip>
                                                    ) : playingStatus === 0 ? (
                                                        <Tooltip placement="top" title="Pause">
                                                            <PauseOutlined />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip placement="top" title="Reload">
                                                            <ReloadOutlined />
                                                        </Tooltip>
                                                    )}
                                                </span>
                                                <span className={styles.forward} onClick={handlePlayForward}>
                                                    <Tooltip placement="top" title="Forward 15s">
                                                        <StepForwardOutlined />
                                                    </Tooltip>
                                                </span>
                                                
                                                <span className={styles.volume} onMouseEnter={() => setVolumeVisible(true)} onMouseLeave={() => setVolumeVisible(false)}>
                                                    <Button className={styles.sound} onClick={handleToggleVolume}>
                                                        {volume === 0 ? (
                                                            <>
                                                                <Mute/>
                                                                <CloseOutlined className={styles.close} />
                                                            </>
                                                        ) : volume < 0.5 ? (
                                                            <SmallVolume/>
                                                        ) : (
                                                            <Volume/>
                                                        )}
                                                    </Button>
                                                    <span className={volumeVisible ? styles.slider : classNames(styles.slider, styles.hiddenSlider)} >
                                                        <Slider
                                                            min={0}
                                                            max={1}
                                                            step={0.1}
                                                            value={volume}
                                                            onChange={value => setVolume(value)}
                                                            onAfterChange={handleSetVolume}
                                                            tooltipVisible={false}
                                                        />
                                                    </span>
                                                </span>
                                                <span className={styles.time}>
                                                    {`${secondsToTime(currentTime.value)} / ${secondsToTime(duration)}`}
                                                </span>
                                            </Col>
                                            <Col span={12} className={styles.right}>
                                                <span className={styles.setting}>
                                                    <Popover
                                                        content={settingsMenu}
                                                        trigger="click"
                                                        placement="top"
                                                        arrowPointAtCenter
                                                        popupClassName={styles.settingsPopover}
                                                        popupAlign={{ offset: [!fullScreen ? 0 : -35, -10] }}
                                                        getPopupContainer={() => divRef.current}
                                                        visible={settingsVisible}
                                                        onVisibleChange={handleSettingsVisibleChange}
                                                    >
                                                        <SettingFilled />
                                                    </Popover>
                                                </span>
                                                <span className={styles.transcript}>
                                                    <Tooltip title="Transcript" placement="top">
                                                        <FileTextFilled />
                                                    </Tooltip>
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                </div> */}
                            </Slide>
                        )}
                        <div className={styles.expand} onClick={handleToggleExpand}>
                            <Tooltip placement="top" title={fullScreen ? "Collapse" : "Full screen"}>
                                <span className={styles.btn}>
                                    {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                                </span>
                            </Tooltip>
                        </div>
                        {playingStatus === 2 && (
                            <div className={classNames(styles.overlay, styles.replay)}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <div onClick={handleTogglePlay}><ReloadOutlined style={{ fontSize: '84px', cursor: 'pointer' }}/></div>
                                        <div className={styles.text}>Play again</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {playingStatus === 1 && (
                            <div className={classNames(styles.overlay, styles.replay)}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <div onClick={handleTogglePlay}><PlayCircleFilled style={{ fontSize: '84px', cursor: 'pointer' }}/></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {waiting && (
                            <div className={styles.overlay}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <Loading3QuartersOutlined style={{ fontSize: '84px', cursor: 'pointer' }} spin/>
                                    </div>
                                </div>
                            </div>
                        )}
                        {error.status === 1 && (
                            <div className={classNames(styles.overlay, styles.error)}>
                                <div className={styles.outer}>
                                    <div className={styles.inlineDiv}>
                                        <FrownOutlined />
                                        <span className={styles.text}>{error.text}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div
                            className={styles.preview}
                            style={{
                                left: preview.left,
                                bottom: preview.bottom,
                                visibility: preview.visible ? 'visible' : 'hidden',
                                height: previewHeight + 4
                            }}
                        >
                            <div className={styles.inner}>
                                <video muted ref={previewRef} className={styles.videoElement} width={previewWidth} height={previewHeight}>
                                    <source src={videoUrl} type="video/mp4" />
                                </video>
                                <span className={styles.time}>{`${secondsToTime(preview.time)}`}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </React.Fragment>
    )
}

export default Video;