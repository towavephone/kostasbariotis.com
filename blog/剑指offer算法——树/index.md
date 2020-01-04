---
title: 剑指offer算法题——树
date: 2018-2-25 14:59:45
categories:
- 面试
tags: 面试, 算法
path: /offer-binary-tree/
---
## 重建二叉树

>输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。



```cpp
#include<iostream>
#include<vector>
#include<queue>
using namespace std;

struct TreeNode
{
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x)
        : val(x), left(NULL), right(NULL) {}
};

class Solution
{
public:
    static TreeNode* reConstructBinaryTree(vector<int> pre,vector<int> in)
    {
        int in_size = in.size();
        int pre_size = pre.size();
        if(in_size == 0 || pre_size == 0)
        {
            return NULL;
        }
        int rootValue = pre[0];
        TreeNode* root = new TreeNode(rootValue);
        if(pre_size == 1 && in_size == 1 && pre[0] == in[0])
        {
            return root;
        }
        vector<int> pre_left;
        vector<int> pre_right;
        vector<int> in_left;
        vector<int> in_right;

        int leftLength;
        for(int i = 0; i< in_size; i++)
        {
            if(in[i] == rootValue)
            {
                // 在中序遍历中找到根节点位置，它的两边即为左右子树
                leftLength = i;
                break;
            }
        }
        // 分别放到对应的数组
        for(int i = 1; i < pre_size; i++)
        {
            if(i <= leftLength)
            {
                pre_left.push_back(pre[i]);
            }
            else
            {
                pre_right.push_back(pre[i]);
            }
        }
        for(int i = 0; i < in_size; i++)
        {
            if(i < leftLength)
            {
                in_left.push_back(in[i]);
            }
            else if(i != leftLength)
            {
                in_right.push_back(in[i]);
            }
        }
        if(leftLength > 0)
        {
            // 构建左子树
            root->left = reConstructBinaryTree(pre_left, in_left);
        }
        if(leftLength < in_size)
        {
            // 构建右子树
            root->right = reConstructBinaryTree(pre_right, in_right);
        }
        return root;
    }
};
//广度优先遍历
void BFS(TreeNode* root){
    queue<TreeNode *> nodeQueue;  //使用C++的STL标准模板库
    nodeQueue.push(root);
    TreeNode *node;
    while(!nodeQueue.empty()){
        node = nodeQueue.front();
        nodeQueue.pop();
        cout<<node->val;
        if(node->left){
            nodeQueue.push(node->left);  //先将左子树入队
        }
        if(node->right){
            nodeQueue.push(node->right);  //再将右子树入队
        }
    }
}
int main()
{
    int i = 0, j = 0;
    vector<int> pre;
    vector<int> in;
    while(cin>>i && i != -1)
    {
        pre.push_back(i);
    }
    while(cin>>j && j != -1)
    {
        in.push_back(j);
    }
    //while(head != NULL)
    //{
    //    cout<<head->val;
    //    head = head->next;
    //}
    BFS(Solution::reConstructBinaryTree(pre, in));
    return 0;
}
```
