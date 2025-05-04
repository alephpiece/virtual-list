import * as React from 'react';
import List, { type ListRef } from '../src/List';

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

const Demo: React.FC = () => {
  // Configurable parameters
  const [overscan, setOverscan] = React.useState(2); // Default overscan value is 2

  // List configuration
  const itemCount = 500;
  const containerHeight = 400;
  const itemHeight = 50;
  const listRef = React.useRef<ListRef>(null);

  // Current visible range
  const [visibleRange, setVisibleRange] = React.useState<[number, number]>([0, 0]);

  // Generate data
  const data = React.useMemo(() => generateData(itemCount), [itemCount]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Overscan Example</h2>

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
          onClick={() => listRef.current?.scrollTo({ index: 10, align: 'center' })}
          style={{ marginRight: 8 }}
        >
          Scroll to #10
        </button>
        <button
          onClick={() => listRef.current?.scrollTo({ index: 50, align: 'center' })}
          style={{ marginRight: 8 }}
        >
          Scroll to #50
        </button>
        <button onClick={() => listRef.current?.scrollTo({ index: 200, align: 'center' })}>
          Scroll to #200
        </button>
      </div>

      {/* List status info */}
      <div style={{ marginBottom: 8 }}>
        <span>
          Current visible area: #{visibleRange[0]} ~ #{visibleRange[1]}
        </span>
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
        style={{ border: '1px solid #ccc', marginTop: 8 }}
        onVisibleChange={(visibleList) => {
          if (visibleList.length > 0) {
            setVisibleRange([visibleList[0].id, visibleList[visibleList.length - 1].id]);
          } else {
            setVisibleRange([0, 0]);
          }
        }}
      >
        {(item, index, props) => (
          <MyItem
            id={item.id}
            style={props.style}
            status={
              item.id >= visibleRange[0] && item.id <= visibleRange[1] ? 'visible' : 'overscan'
            }
          />
        )}
      </List>

      {/* Simple note */}
      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <p>
          <strong>Note:</strong> Increasing the overscan value can make scrolling smoother, but will
          increase rendering overhead. In real applications, you should choose an appropriate
          overscan value based on your needs. Usually, 1-3 is enough.
        </p>
      </div>
    </div>
  );
};

export default Demo;
