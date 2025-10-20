import React,{ useState } from 'react'
import { cmm, journal } from '../static_data';
import RenderResponse from '../renderResponse';
import '../../css/components/pages/review.css'

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
        <button onClick={() => handleClick('journal')} className="interface-button">
          JOURNAL
        </button>
        <button onClick={() => handleClick('cmm')} className="interface-button">
          CMM
        </button>
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