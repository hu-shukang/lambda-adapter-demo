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

function nodeElement(
  node: TreeNode<OrganizationInfo>,
  checked: OrganizationInfo | undefined,
  checkHandler: CheckHandler,
) {
  return (
    <div className="inline-flex items-center space-x-2">
      <Checkbox
        id={node.id}
        checked={node.id === checked?.pk}
        onCheckedChange={(val) => {
          checkHandler(val ? node.origin : undefined);
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
}

function toTreeNode(
  organizations: OrganizationInfo[],
  organization: OrganizationInfo,
  checkHandler: CheckHandler,
  checked: OrganizationInfo | undefined,
  showed: Array<string>,
): TreeNode<OrganizationInfo> {
  const children: Array<TreeNode<OrganizationInfo>> = [];
  const childOrg = organizations.filter((o) => o.parent === organization.pk);
  const otherOrg = organizations.filter((o) => o.parent !== organization.pk);
  for (let i = 0; i < childOrg.length; i++) {
    const childTreeNode = toTreeNode(otherOrg, childOrg[i], checkHandler, checked, showed);
    children.push(childTreeNode);
  }
  const node: TreeNode<OrganizationInfo> = {
    id: organization.pk,
    element: (organization) => nodeElement(organization, checked, checkHandler),
    show: showed.includes(organization.pk),
    checked: organization.pk === checked?.pk,
    origin: organization,
    children: children.length > 0 ? children : undefined,
  };

  return node;
}

function toTree(
  organizations: OrganizationInfo[],
  checkHandler: CheckHandler,
  checked: OrganizationInfo | undefined,
  showed: Array<string>,
): TreeNode<OrganizationInfo> {
  const root = organizations.find((o) => o.parent === undefined) as OrganizationInfo;
  const otherOrg = organizations.filter((o) => o.parent !== undefined);
  return toTreeNode(otherOrg, root, checkHandler, checked, showed);
}

export default function OrganizationTreeView({ organizations, checked, onCheckChanged }: Props) {
  const [showed, setShowed] = useState<Array<string>>(organizations.map((o) => o.pk));

  const organizationTree = useMemo(
    () => toTree(organizations, onCheckChanged, checked, showed),
    [organizations, onCheckChanged, checked, showed],
  );

  const toggleShowHandler = useCallback(
    (node: TreeNode<OrganizationInfo>) => {
      if (node.show) {
        setShowed(showed.filter((s) => s !== node.id));
      } else {
        setShowed([...showed, node.id]);
      }
    },
    [showed],
  );

  return <TreeView node={organizationTree} toggleShow={toggleShowHandler} />;
}
