import React, { useEffect, useState } from 'react';

const RenderResponse = ({ data }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    if(data){
        setSelectedChannel(null)
        setComments({})
        setSelectedTab(null)
    }
  }, [data]);
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

  const handleReviewSubmit = (status) => {
    if (!selectedChannel || !selectedTab) return;

    const currentComments = comments[selectedChannel]?.[selectedTab] || {};

    // ✅ Correct: Save comments to reviewComments and status to reviewStatus
    data[selectedChannel].tabs[selectedTab].reviewComments = currentComments;
    data[selectedChannel].tabs[selectedTab].reviewStatus = status;

    console.log('Updated tab:', data[selectedChannel].tabs[selectedTab]);

    console.log(`data after submit:: ${JSON.stringify(data)}`)
    
  // Move to next tab automatically
  const tabKeys = Object.keys(data[selectedChannel].tabs);
  const currentIndex = tabKeys.indexOf(selectedTab);

  if (currentIndex < tabKeys.length - 1) {
    const nextTab = tabKeys[currentIndex + 1];
    setSelectedTab(nextTab);
  } else {
    // Optional: handle end of tab list
    alert("All tabs reviewed for this channel.");
  }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
      {/* Channel Buttons */}
        <h3>Select Channel:</h3>
        {Object.keys(data).map((channel) => (
          <button
            key={channel}
            onClick={() => {
              setSelectedChannel(channel);
              setSelectedTab(null);
            }}
            style={{
              marginRight: '10px',
              backgroundColor: selectedChannel === channel ? '#4caf50' : '#ccc',
              color: selectedChannel === channel ? 'white' : 'black'
            }}
          >
            {channel.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Buttons */}
      {selectedChannel && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Select Tab in <strong>{selectedChannel}</strong>:</h4>
          {data[selectedChannel]?.tabs?
            Object.keys(data[selectedChannel].tabs).map((tab) => (
            <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                marginRight: '10px',
                backgroundColor: selectedTab === tab ? '#2196f3' : '#eee',
                color: selectedTab === tab ? 'white' : 'black'
                }}
            >
            {tab}
            </button>
            )) : null}
        </div>
      )}

      {/* Diff Table */}
      {selectedChannel && selectedTab && (
        <div>
          <h4>
            Diff for <strong>{selectedChannel}</strong> → <strong>{selectedTab}</strong>
          </h4>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Field</th>
                <th>Value1</th>
                <th>Value2</th>
                <th>Review Comments</th>
              </tr>
            </thead>
            <tbody>
              {data[selectedChannel]?.tabs ? Object.entries(data[selectedChannel].tabs[selectedTab].diff).map(
                ([fieldKey, versionMap]) =>
                  Object.entries(versionMap).map(([v1, v2]) => (
                    <tr key={`${selectedChannel}-${selectedTab}-${fieldKey}`}>
                      <td>{fieldKey}</td>
                      <td>{v1}</td>
                      <td>{v2}</td>
                      <td>
                        <input
                          type="text"
                          value={
                            comments[selectedChannel]?.[selectedTab]?.[fieldKey] || ''
                          }
                          onChange={(e) =>
                            handleCommentChange(
                              selectedChannel,
                              selectedTab,
                              fieldKey,
                              e.target.value
                            )
                          }
                          style={{ width: '100%' }}
                        />
                      </td>
                    </tr>
                  ))
              ) : null}
            </tbody>
          </table>

          {/* Review Status Submit Buttons */}
          <div style={{ marginTop: '20px' }}>
            <h4>Submit Review:</h4>
            <button
              onClick={() => handleReviewSubmit('Go')}
              style={{
                marginRight: '10px',
                backgroundColor: 'green',
                color: 'white',
                padding: '10px 20px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go
            </button>
            <button
              onClick={() => handleReviewSubmit('NoGo')}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '10px 20px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              NoGo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderResponse;
