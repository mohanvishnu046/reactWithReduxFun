import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { generateKeyFromData } from '../util/utils';
import '../css/components/finalReview.css';

const FinalReview = ({ selectedChannel, selectedInterface }) => {
  const jsonData = useSelector((state) => state.review.data);
  const [localData, setLocalData] = useState({});

  useEffect(() => {
    processLocalData();
  }, [selectedChannel,selectedInterface]);

  const processLocalData = () => {
    const key = generateKeyFromData(selectedInterface, selectedChannel);
    if (jsonData[key]) {
      setLocalData(jsonData[key]);
    }
  };

  const getReviewSummary = () => {
    if (!localData.tabs) return [];

    return Object.entries(localData.tabs).map(([tabName, tabData]) => ({
      tabName,
      status: tabData.reviewStatus || 'Not Reviewed',
      comments: Object.entries(tabData.reviewComments || {})
        .map(([field, comment]) => `${field}: ${comment}`)
        .join('; '),
    }));
  };

  const reviewSummary = getReviewSummary();

  return (
    <div className="final-review-table">
      <h3>Final Review Summary – {selectedChannel.toUpperCase()}</h3>
      <table>
        <thead>
          <tr>
            <th>Tab Name</th>
            <th>Review Status</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {reviewSummary.map(({ tabName, status, comments }) => (
            <tr key={tabName}>
              <td>{tabName}</td>
              <td>{status}</td>
              <td>{comments || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinalReview;
