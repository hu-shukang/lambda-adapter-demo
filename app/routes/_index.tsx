import { CheckedState } from '@radix-ui/react-checkbox';
import { Link } from '@remix-run/react';
import TreeView, { TreeNode } from '~/components/common/tree-view';
import { Button } from '~/components/ui/button';

export default function Index() {
  const data: TreeNode = {
    id: '1',
    text: 'Root',
    show: true,
    children: [
      {
        id: '1-1',
        text: '管理部门',
        show: true,
      },
      {
        id: '1-2',
        text: '开发部门',
        show: true,
        children: [
          {
            id: '1-2-1',
            text: '开发1部',
            show: true,
          },
          {
            id: '1-2-2',
            text: '开发2部',
            show: true,
            children: [
              {
                id: '1-2-2-1',
                text: 'Team 1',
                show: true,
              },
              {
                id: '1-2-2-2',
                text: 'Team 2',
                show: true,
              },
            ],
          },
        ],
      },
      {
        id: '1-3',
        text: '营业部门',
        show: true,
      },
    ],
  };

  const checkHandler = (node: TreeNode, checked: CheckedState) => {
    node.checked = checked as boolean;
  };

  const showHandler = (node: TreeNode, value: boolean) => {
    node.show = value;
  };

  return (
    <div>
      <div>Home Page</div>
      <Link to={'/dashboard'}>
        <Button>Go to Dashboard</Button>
      </Link>
      <div className="p-10">
        <TreeView node={data} checkHandler={checkHandler} showHandler={showHandler} />
      </div>
    </div>
  );
}
