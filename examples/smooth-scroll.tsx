import * as React from 'react';
import List, { type ListRef } from '../src/List';

interface Item {
  id: number;
}

const MyItem: React.FC<{
  id: number;
}> = ({ id }) => (
  <div
    style={{
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #eee',
      backgroundColor: '#fff',
    }}
  >
    {id}
  </div>
);

const generateData = (count: number): Item[] => {
  const data: Item[] = [];
  for (let i = 0; i < count; i += 1) {
    data.push({ id: i });
  }
  return data;
};

const Demo: React.FC = () => {
  const [mode, setMode] = React.useState<'true' | 'false' | 'custom'>('true');
  const [stepRatio, setStepRatio] = React.useState(0.33);

  const itemCount = 200;
  const containerHeight = 400;
  const itemHeight = 50;
  const listRef = React.useRef<ListRef>(null);

  const data = React.useMemo(() => generateData(itemCount), [itemCount]);

  let smoothScroll: boolean | { stepRatio: number };
  if (mode === 'true') {
    smoothScroll = true;
  } else if (mode === 'false') {
    smoothScroll = false;
  } else {
    smoothScroll = { stepRatio };
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Smooth Virtual Scroll</h2>

      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8, fontWeight: 500 }}>smoothScroll:</span>
        <label style={{ marginRight: 16 }}>
          <input
            type="radio"
            name="smoothScrollMode"
            value="true"
            checked={mode === 'true'}
            onChange={() => setMode('true')}
          />
          true
        </label>
        <label style={{ marginRight: 16 }}>
          <input
            type="radio"
            name="smoothScrollMode"
            value="false"
            checked={mode === 'false'}
            onChange={() => setMode('false')}
          />
          false
        </label>
        <label style={{ marginRight: 16 }}>
          <input
            type="radio"
            name="smoothScrollMode"
            value="custom"
            checked={mode === 'custom'}
            onChange={() => setMode('custom')}
          />
          custom
        </label>
        {mode === 'custom' && (
          <span style={{ marginLeft: 16 }}>
            stepRatio:
            <input
              type="range"
              min={0.01}
              max={1}
              step={0.01}
              value={stepRatio}
              onChange={(e) => setStepRatio(Number(e.target.value))}
              style={{ margin: '0 8px', verticalAlign: 'middle' }}
            />
            <span style={{ display: 'inline-block', width: 40 }}>{stepRatio.toFixed(2)}</span>
          </span>
        )}
      </div>

      <List
        ref={listRef}
        data={data}
        height={containerHeight}
        itemHeight={itemHeight}
        itemKey="id"
        smoothScroll={smoothScroll}
        style={{ border: '1px solid #ccc', marginTop: 8 }}
      >
        {(item) => <MyItem id={item.id} />}
      </List>

      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <p>
          <strong>Note:</strong> When <code>stepRatio</code> is close to 1, the scroll will be very
          fast and less smooth. When it is close to 0, the scroll will be very smooth but may feel
          slow. Usually, 0.2~0.4 is a good balance.
        </p>
      </div>
    </div>
  );
};

export default Demo;
