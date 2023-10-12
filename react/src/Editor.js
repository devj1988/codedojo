
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

const Editor = ({initialCode, onChange}) => {
   return <div className="Editor">
              <CodeMirror
                  value={initialCode}
                  height="50vh"
                  extensions={[python({})]}
                  onChange={onChange}
                  basicSetup={{
                    autocompletion: false
                  }}
              />
            </div>
}

export default Editor;