import * as React from 'react';
import List, { type ListRef } from '../src/List';
import './basic.less';

interface Item {
  id: number;
}

// Render item component, use different background colors to distinguish visible and overscan areas
const MyItem: React.FC<{
  id: number;
  style: React.CSSProperties;
  status: 'visible' | 'overscan'; // Item status
}> = ({ id, style, status }) => (
  <div
    style={{
      ...style,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #eee',
      backgroundColor: status === 'visible' ? '#fff' : '#e6f7ff',
    }}
  >
    {id} {status === 'overscan' && '(overscan)'}
  </div>
);

// Generate example data
const generateData = (count: number): Item[] => {
  const data: Item[] = [];
  for (let i = 0; i < count; i += 1) {
    data.push({ id: i });
  }
  return data;
};

const OverscanDemo: React.FC = () => {
  // Configurable parameters
  const [overscan, setOverscan] = React.useState(2); // Default overscan value is 2
  const [itemCount, setItemCount] = React.useState(500); // Default item count

  // List configuration
  const containerHeight = 400;
  const itemHeight = 50;
  const listRef = React.useRef<ListRef>(null);

  // Scroll state
  const [scrollTop, setScrollTop] = React.useState(0);

  // Calculate visible area range
  const visibleCount = Math.floor(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount - 1);

  // Generate data
  const data = React.useMemo(() => generateData(itemCount), [itemCount]);

  // Handle scroll event
  const handleScroll: React.UIEventHandler<HTMLElement> = (e) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Overscan Example</h2>
      <p>
        The <strong>overscan</strong> parameter controls how many extra items are rendered before and after the visible area in the virtual list. This helps improve scroll smoothness and prevents blank areas during fast scrolling. In this example, items with a <strong>white background</strong> are within the visible area, while items with a <strong>blue background</strong> are rendered due to overscan.
      </p>

      {/* Control panel */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 16 }}>
          Overscan value:
          <input
            type="number"
            min="0"
            max="10"
            value={overscan}
            onChange={(e) => setOverscan(Math.max(0, parseInt(e.target.value, 10) || 0))}
            style={{ marginLeft: 8, width: 60 }}
          />
        </label>

        <button
          onClick={() => listRef.current?.scrollTo({ index: 10, align: 'top' })}
          style={{ marginRight: 8 }}
        >
          Scroll to #10
        </button>
        <button
          onClick={() => listRef.current?.scrollTo({ index: 50, align: 'top' })}
          style={{ marginRight: 8 }}
        >
          Scroll to #50
        </button>
        <button
          onClick={() => listRef.current?.scrollTo({ index: 200, align: 'top' })}
        >
          Scroll to #200
        </button>
      </div>

      {/* List status info */}
      <div style={{ marginBottom: 8 }}>
        <span>Current visible area: #{startIndex} ~ #{endIndex}</span>
        <span style={{ marginLeft: 16 }}>Overscan: {overscan}</span>
      </div>

      {/* Virtual list */}
      <List
        ref={listRef}
        data={data}
        height={containerHeight}
        itemHeight={itemHeight}
        itemKey="id"
        overscan={overscan}
        smoothScroll={true}
        onScroll={handleScroll}
        style={{ border: '1px solid #ccc', marginTop: 8 }}
      >
        {(item, index, props) => (
          <MyItem 
            id={item.id} 
            style={props.style}
            status={
              (index >= startIndex && index <= endIndex)
                ? 'visible'
                : 'overscan'
            }
          />
        )}
      </List>

      {/* Simple note */}
      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <p>
          <strong>Note:</strong> Increasing the overscan value can make scrolling smoother, but will increase rendering overhead. In real applications, you should choose an appropriate overscan value based on your needs. Usually, 1-3 is enough.
        </p>
      </div>
    </div>
  );
};

export default OverscanDemo; 