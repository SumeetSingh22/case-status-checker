import { Box, ScrollArea } from '@radix-ui/themes';
import { Drawer } from 'vaul';


export default function Logs({logs}) {

function formatHumanReadableDate(isoString) {
  const date = new Date(isoString);

  const options = {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
    timeZoneName: 'short' 
  };

  return date.toLocaleString('en-US', options);
}

    
  return (
    <Drawer.Root  direction="right">
      <Drawer.Trigger asChild><p style={{marginTop:'24px',display:'inline-block',fontSize:'16px',fontStyle:'italic',borderBottom:'1px dashed var(--accent-9)',cursor:'pointer'}} className='serif'>View audit</p></Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content style={{position: 'fixed', right: 0, top: 0, bottom: 0, width: '30%', backgroundColor: 'white', boxShadow: '0 -2px 9px -1px rgba(66,68,90,.3)', display:'flex',height:'100vh',flexDirection:'column',padding:'20px 20px 4px'}}>
          <Drawer.Title style={{marginBottom:'8px',textAlign:'center'}} className='serif'>Logs</Drawer.Title>
          <ScrollArea type='auto' style={{height: '100%'}} >
            <ul style={{listStyleType:'none', padding:'0',margin:'0',paddingTop:'8px'}}>
                {logs.length > 0 && (
                    logs.map((log)=>{
                        return <li style={{padding:'8px', boxShadow:'0 1px 4px 1px rgba(6, 10, 36, .1), 0 5px 10px 0 rgba(6, 10, 36, .08)',margin:'0 4px 8px',borderRadius:'4px'}} key={log.pzInsKey}>
                            <Box><p>{log.pyMessageKey}</p></Box>
                            <Box style={{fontSize:'14px',color:'#444'}}><cite>by {log.pyPerformer}</cite>&nbsp;- <span>{formatHumanReadableDate(log.pxTimeCreated)}</span></Box>
                        </li>
                    })
                )}
            </ul>
          </ScrollArea>
        </Drawer.Content>
        <Drawer.Overlay style={{position:'fixed',background:'rgba(0,0,0,0.4)'}}/>
      </Drawer.Portal>
    </Drawer.Root>
  );
}