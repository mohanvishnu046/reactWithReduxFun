import React,{ useState } from 'react'
import { cmm, journal } from '../static_data';
import RenderResponse from '../renderResponse';

const Review = () => {
    const [data, setData] = useState(null);

  const handleClick = async (type) => {
    let result;
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
  <div style={{ paddingTop: '40px', position: 'absolute', top: '10px', left: '10px', zIndex: 10, display:'flex', gap:'10px'}}>
    <button onClick={() => handleClick('journal')}>JOURNAL</button>
    <button onClick={() => handleClick('cmm')}>CMM</button>
  </div>

  {/* Add top padding equal to or more than button height */}
  {data && <div style={{ paddingTop: '60px', position: 'relative', zIndex: 1 }}>
    <RenderResponse data={data} />
  </div>}
  </>
  )
}

export default Review