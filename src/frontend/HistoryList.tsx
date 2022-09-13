import { prettifyTimestamp, Session } from './table/lib';

interface HistoryListProps {
  players: any[];
  sessions: Session[];
}

export function HistoryList(props: HistoryListProps) {
  return (
    <div
      style={{
        display: 'grid',
        rowGap: 4,
        height: 300,
        overflow: 'auto',
        paddingTop: 8,
      }}
    >
      {props.sessions.map((s) => (
        <div
          key={s._id}
          style={{
            borderRadius: 8,
            border: '1px solid lightgray',
            padding: 8,
            background: 'white',
            margin: '0 16px',
            fontSize: 14,
          }}
        >
          <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <div>{s.totalPoints === 10 ? 'To 5' : 'To 11'}</div>
            <div>{prettifyTimestamp(s.timestamp)}</div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr min-content 1fr',
              columnGap: 8,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              {s.participantsA.emails.map((email) => (
                <div
                  key={email}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {props.players.find((p) => p.email === email)?.name || email}
                </div>
              ))}
            </div>
            <div style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              {s.participantsA.numSetsWon + '-' + s.participantsB.numSetsWon}
            </div>
            <div style={{ overflow: 'hidden' }}>
              {s.participantsB.emails.map((email) => (
                <div
                  key={email}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'end',
                  }}
                >
                  {props.players.find((p) => p.email === email)?.name || email}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
