import React,{ useState } from 'react'
import { cmm, journal } from '../static_data';
import RenderResponse from '../renderResponse';
import '../../css/components/pages/review.css';
import { interfaceNames } from '../static_data';

const Review = () => {
    const [data, setData] = useState(null);
    const [selectedInterface,setSelectedInterface] = useState(null);
  const handleClick = async (type) => {
    let result;
    setSelectedInterface(type)
    switch(type) {
      case "journal":
        result = journal;
        break;
      case "cmm":
        result = cmm;
        break;
      default:
        result = null;
    }
    setData(result);
  };
  return (
    <>
      <h3>Choose interface to review:</h3>
  
      {/* Interface Selection Buttons */}
      <div className="interface-buttons">
      {interfaceNames.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => handleClick(type)}
          className={`interface-button ${selectedInterface === type ? 'selected' : ''}`}
        >
          {label}
    </button>
  ))}
      </div>
  
      {/* RenderResponse Component */}
      {data && (
        <div className="render-response-container">
          <RenderResponse data={data} interfaceName={selectedInterface} />
        </div>
      )}
    </>
  );
  
}

export default Review