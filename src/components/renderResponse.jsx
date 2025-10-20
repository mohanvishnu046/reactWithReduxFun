import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storeJson, updateJson } from '../redux/jsonSlicer';
import '../css/components/renderResponse.css'
import DiffTable from './DiffTab';

const RenderResponse = ({data, interfaceName}) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [comments, setComments] = useState({});
  const dispatch = useDispatch();
  const jsonData = useSelector((state) => state.review.data);
  const [localData, setLocalData] =useState({});
  useEffect(() => {
    if(data){
        setSelectedChannel(null)
        setComments({})
        setSelectedTab(null)
    }
  }, [data]);
  // Extract reviewComments into the desired structure
  useEffect(() => {
    if (selectedChannel && selectedTab && localData?.tabs) {
      const tabData = localData.tabs[selectedTab];
      const extractedComments = {};

      // Iterate over each field and store comments separately
      for (let field in tabData.reviewComments) {
        extractedComments[field] = tabData.reviewComments[field];
      }

      // Store the comments in the structure you want
      setComments((prevComments) => ({
        ...prevComments,
        [selectedChannel]: {
          ...prevComments[selectedChannel],
          [selectedTab]: extractedComments
        }
      }));
    }
  }, [selectedChannel, selectedTab, data]);

  const handleCommentChange = (channel, tab, field, comment) => {
    setComments((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [tab]: {
          ...((prev[channel] && prev[channel][tab]) || {}),
          [field]: comment
        }
      }
    }));
  };

  const generateKeyFromData = (interfaceName,channel) => {
    return `${interfaceName}_${channel}`;
  };

  const isChannelDataAvailable = (key) => { // Check if key exists in redux store
    return jsonData && jsonData.hasOwnProperty(key);
  };
  
   // When a channel is selected, check if the data is available in the Redux store
   const handleChannelSelection = (channel) => {
    setSelectedChannel(channel);
    setSelectedTab(null);
    
    if (data[channel]?.tabs) {
      const tabs = Object.keys(data[channel].tabs);
      
      if (tabs.length > 0) {
        setSelectedTab(tabs[0]);
      }
    }
      
    const key = generateKeyFromData(interfaceName,channel);
    if (isChannelDataAvailable(key)) {
      const storedData = jsonData[key];
      console.log(`founded data for key ${key} and ${JSON.stringify(storedData)}`)
    if (storedData) {
      // Update local state with the fetched data to trigger re-render
      setLocalData(storedData);
      
    }
    } else {
      console.log(`Data for ${key} not found in Redux store.`);
      //If key is not present then save it in redux 
      //store and give it to render..
      dispatch(storeJson({
        key: key,
        json: data[channel]
      }));
      setLocalData(data[channel])
    }
  };

  const handleReviewSubmit = (status) => {
    if (!selectedChannel || !selectedTab) return;

    //deep copy to append reviewCOments and reviewStatus.
    const newLocalData = JSON.parse(JSON.stringify(localData));

    // console.log(`deep copy of localData is ${JSON.stringify(newLocalData)}`)
    
    //deep copy of selected tab
    const selectedTabData = { ...newLocalData.tabs[selectedTab] };

    // console.log(`deep copy of localData tabs is ${JSON.stringify(selectedTabData)}`)
    
    //add reviewStatus
    selectedTabData.reviewStatus = status;
    //add reviewComments
    selectedTabData.reviewComments = comments[selectedChannel]?.[selectedTab] || {};
    
    // console.log(`selectedTab after adding status and comments ${JSON.stringify(selectedTabData)}`)
    newLocalData.tabs[selectedTab] = selectedTabData;
    // console.log(`newLocalData after submit :: ${JSON.stringify(newLocalData)}`)
  
    setLocalData(newLocalData);
    const key = generateKeyFromData(interfaceName, selectedChannel);
    dispatch(updateJson({
      key: key,
      updates: newLocalData, // Store the updated channel data back to Redux
    }));
  
  console.log(`newLocalData ${selectedTab}:: ${JSON.stringify(newLocalData)}`)  
  // Move to next tab automatically
  const tabKeys = Object.keys(localData.tabs);
  const currentIndex = tabKeys.indexOf(selectedTab);

  if (currentIndex < tabKeys.length - 1) {
    const nextTab = tabKeys[currentIndex + 1];
    setSelectedTab(nextTab);
  } else {
    // Optional: handle end of tab list
      console.log(`newLocalData after submit :: ${JSON.stringify(newLocalData)}`)  
    // alert("All tabs reviewed for this channel.");
  }
  };

  return (
    <div className="render-response">
      <div className="channel-buttons">
        {/* Channel Buttons */}
        <h3>Select Channel:</h3>
        {Object.keys(data).map((channel) => (
          <button
            key={channel}
            onClick={() => handleChannelSelection(channel)}
            className={selectedChannel === channel ? 'selected' : 'unselected'}
          >
            {channel.toUpperCase()}
          </button>
        ))}
      </div>
  
      {/* Tab Buttons */}
      {selectedChannel && (
        <div className="tab-buttons">
          <h4>Select Tab in <strong>{selectedChannel}</strong>:</h4>
          {localData?.tabs
            ? Object.keys(localData.tabs).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={selectedTab === tab ? 'selected' : 'unselected'}
                >
                  {tab}
                </button>
              ))
            : null}
        </div>
      )}
  
      {/* Diff Table */}
      {selectedChannel && selectedTab && (
        <>
        <DiffTable
        selectedChannel={selectedChannel}
        selectedTab={selectedTab}
        data={localData}
        comments={comments} 
        handleCommentChange = {handleCommentChange}/>
        {/* Review Status Submit Buttons */}
      <div className="review-buttons">
      <h4>Submit Review:</h4>
      <button
        onClick={() => handleReviewSubmit('Go')}
        className="go"
      >
        Go
      </button>
      <button
        onClick={() => handleReviewSubmit('NoGo')}
        className="no-go"
      >
        NoGo
      </button>
    </div>
        </>
      )}
    </div>
  );
};

export default RenderResponse;
