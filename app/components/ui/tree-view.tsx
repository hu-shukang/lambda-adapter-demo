import { CirclePlusIcon, CircleMinusIcon } from 'lucide-react';

export type TreeNode<T> = {
  id: string;
  element: (node: TreeNode<T>) => React.ReactElement;
  origin: T;
  show: boolean;
  checked?: boolean;
  children?: Array<TreeNode<T>>;
};

export type TreeViewProps<T> = {
  node: TreeNode<T>;
  toggleShow: (node: TreeNode<T>) => void;
};

function NodeToggle<T>({ node, toggleShow }: TreeViewProps<T>) {
  if (!node.children) {
    return <div className="empty-toggle"></div>;
  }
  if (node.show) {
    return <CircleMinusIcon className="toggle" width={20} height={20} onClick={() => toggleShow(node)} />;
  }
  return <CirclePlusIcon className="toggle" width={20} height={20} onClick={() => toggleShow(node)} />;
}

function NodeView<T>({ node, toggleShow }: TreeViewProps<T>) {
  return (
    <li className="tree-node">
      <div>
        <div className="tree-node-item">
          <NodeToggle node={node} toggleShow={toggleShow} />
          {node.element(node)}
        </div>
        {node.show && node.children && (
          <ul className="tree">
            {node.children.map((sn) => (
              <NodeView key={sn.id} node={sn} toggleShow={toggleShow} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function TreeView<T>({ node, toggleShow }: TreeViewProps<T>) {
  return (
    <ul className="tree">
      <NodeView node={node} toggleShow={toggleShow} />
    </ul>
  );
}
