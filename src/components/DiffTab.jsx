import React from 'react';

const DiffTable = ({ selectedChannel, selectedTab, data, comments, handleCommentChange }) => {
  return (
    <div className="diff-table">
      <h4>
        Diff for <strong>{selectedChannel}</strong> → <strong>{selectedTab}</strong>
      </h4>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value1</th>
            <th>Value2</th>
            <th>Review Comments</th>
          </tr>
        </thead>
        <tbody>
          {data?.tabs
            ? Object.entries(data.tabs[selectedTab].diff).map(
                ([fieldKey, versionMap]) =>
                  Object.entries(versionMap).map(([v1, v2]) => (
                    <tr key={fieldKey}>
                      <td>{fieldKey}</td>
                      <td>{v1}</td>
                      <td>{v2}</td>
                      <td>
                        <input
                          type="text"
                          value={comments[selectedChannel]?.[selectedTab]?.[fieldKey] || ''}
                          onChange={(e) =>
                            handleCommentChange(selectedChannel, selectedTab, fieldKey, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))
              )
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default DiffTable;
