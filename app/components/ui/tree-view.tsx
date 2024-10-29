import { CirclePlusIcon, CircleMinusIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export type TreeNode<T> = {
  id: string;
  origin: T;
  show: boolean;
  checked?: boolean;
  children?: Array<TreeNode<T>>;
};

export type TreeViewProps<T> = {
  node: TreeNode<T>;
  toggleShow: (node: TreeNode<T>) => void;
  renderNodeElement: (node: TreeNode<T>) => React.ReactElement;
};

function NodeToggle<T>({ node, toggleShow }: Omit<TreeViewProps<T>, 'renderNodeElement'>) {
  if (!node.children) {
    return <div className="empty-toggle"></div>;
  }
  return (
    <motion.div
      className="toggle"
      onClick={() => toggleShow(node)}
      initial={{ rotate: 0 }}
      animate={{ rotate: node.show ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {node.show ? <CircleMinusIcon width={20} height={20} /> : <CirclePlusIcon width={20} height={20} />}
    </motion.div>
  );
}

function NodeView<T>({ node, toggleShow, renderNodeElement }: TreeViewProps<T>) {
  return (
    <li className="tree-node">
      <div>
        <div className="tree-node-item">
          <NodeToggle node={node} toggleShow={toggleShow} />
          {renderNodeElement(node)}
        </div>
        {node.show && node.children && (
          <motion.ul
            className="tree"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {node.children.map((sn) => (
              <NodeView key={sn.id} node={sn} toggleShow={toggleShow} renderNodeElement={renderNodeElement} />
            ))}
          </motion.ul>
        )}
      </div>
    </li>
  );
}

export default function TreeView<T>({ node, toggleShow, renderNodeElement }: TreeViewProps<T>) {
  return (
    <ul className="tree">
      <NodeView node={node} toggleShow={toggleShow} renderNodeElement={renderNodeElement} />
    </ul>
  );
}
