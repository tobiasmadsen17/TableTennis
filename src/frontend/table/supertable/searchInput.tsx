import { AiOutlineSearch } from 'react-icons/ai';

interface SearchInputProps {
  value: string;
  onChange(newValue: string): void;
}

export function SearchInput(props: SearchInputProps) {
  return (
    <div
      style={{
        borderBottom: '1px solid lightgray',
        marginBottom: -6,
        display: 'flex',
      }}
    >
      <AiOutlineSearch style={{ fontSize: 20, marginRight: 8 }} />
      <input
        placeholder="Search items..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: 16,
          marginBottom: 4,
        }}
      />
    </div>
  );
}
