import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '../ui/checkbox';
import { TriangleRightIcon } from '@radix-ui/react-icons';

export type TreeNode = {
  id: string;
  text: string;
  show: boolean;
  checked?: boolean;
  children?: Array<TreeNode>;
};

export type TreeViewProps = {
  node: TreeNode;
  checkHandler: (node: TreeNode, checked: CheckedState) => void;
  showHandler: (node: TreeNode, show: boolean) => void;
};

function NodeView({ node, checkHandler, showHandler }: TreeViewProps) {
  const onCheckedChange = (checked: CheckedState) => {
    checkHandler(node, checked);
  };
  const toogleShow = () => {
    console.log(node);
    showHandler(node, !node.show);
  };

  return (
    <li className="tree-node">
      <div>
        <div className="tree-node-item">
          <TriangleRightIcon width={20} height={20} onClick={toogleShow} />
          <Checkbox id={node.id} checked={node.checked} onCheckedChange={onCheckedChange} />
          <label
            htmlFor={node.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {node.text}
          </label>
        </div>
        {node.show && node.children && (
          <ul className="tree">
            {node.children.map((sn) => (
              <NodeView key={sn.id} node={sn} showHandler={showHandler} checkHandler={checkHandler} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function TreeView({ node, checkHandler, showHandler }: TreeViewProps) {
  return (
    <ul className="tree">
      <NodeView node={node} checkHandler={checkHandler} showHandler={showHandler} />
    </ul>
  );
}
