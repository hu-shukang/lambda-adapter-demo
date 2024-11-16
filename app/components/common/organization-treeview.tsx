import { OrganizationInfo } from '~/models/organization.model';
import TreeView, { TreeNode } from '../ui/tree-view';
import { Checkbox } from '../ui/checkbox';
import { useCallback, useMemo, useState } from 'react';

type CheckHandler = (organizations: OrganizationInfo | undefined) => void;

type Props = {
  organizations: OrganizationInfo[];
  checked: OrganizationInfo | undefined;
  onCheckChanged: CheckHandler;
};

function toTreeNode(
  organizations: OrganizationInfo[],
  organization: OrganizationInfo,
  checkHandler: CheckHandler,
  checked: OrganizationInfo | undefined,
  showed: Set<string>,
): TreeNode<OrganizationInfo> {
  const children: Array<TreeNode<OrganizationInfo>> = [];
  const childOrg = organizations.filter((o) => o.parentId === organization.id);
  const otherOrg = organizations.filter((o) => o.parentId !== organization.id);
  for (let i = 0; i < childOrg.length; i++) {
    const childTreeNode = toTreeNode(otherOrg, childOrg[i], checkHandler, checked, showed);
    children.push(childTreeNode);
  }
  const node: TreeNode<OrganizationInfo> = {
    id: organization.id,
    show: showed.has(organization.id),
    checked: organization.id === checked?.id,
    origin: organization,
    children: children.length > 0 ? children : undefined,
  };

  return node;
}

function toTree(
  organizations: OrganizationInfo[],
  checkHandler: CheckHandler,
  checked: OrganizationInfo | undefined,
  showed: Set<string>,
): TreeNode<OrganizationInfo> {
  const root = organizations.find((o) => o.parentId === null) as OrganizationInfo;
  const otherOrg = organizations.filter((o) => o.parentId !== null);
  return toTreeNode(otherOrg, root, checkHandler, checked, showed);
}

export default function OrganizationTreeView({ organizations, checked, onCheckChanged }: Props) {
  const [showed, setShowed] = useState<Set<string>>(new Set(organizations.map((o) => o.id)));

  const organizationTree = useMemo(
    () => toTree(organizations, onCheckChanged, checked, showed),
    [organizations, onCheckChanged, checked, showed],
  );

  const toggleShowHandler = useCallback(
    (node: TreeNode<OrganizationInfo>) => {
      const updatedShowed = new Set(showed);
      if (node.show) {
        updatedShowed.delete(node.id);
      } else {
        updatedShowed.add(node.id);
      }
      setShowed(updatedShowed);
    },
    [showed],
  );

  const renderNodeElement = (node: TreeNode<OrganizationInfo>) => (
    <div className="inline-flex items-center space-x-2">
      <Checkbox
        id={node.id}
        checked={node.id === checked?.id}
        onCheckedChange={(val) => {
          onCheckChanged(val ? node.origin : undefined);
        }}
      />
      <label
        htmlFor={node.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {node.origin.name}
      </label>
    </div>
  );

  return <TreeView node={organizationTree} toggleShow={toggleShowHandler} renderNodeElement={renderNodeElement} />;
}
