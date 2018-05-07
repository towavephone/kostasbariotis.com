---
title: 剑指offer算法题——链表
date: 2018-2-21 11:04:04
categories:
- 面试
tags: 面试, 算法
path: /offer-linked-list/
---
## 链表操作

### 链表末尾添加节点

```c++
struct ListNode
{
    int m_nValue;
    ListNode* m_pNext;
};
void AddToTail(ListNode** pHead, int value)
{
    ListNode *pNew = new ListNode();
    pNew->m_nValue = value;
    pNew->m_pNext = NULL;
    if(*pHead == NULL)
    {
        *pHead = pNew;
    }
    else
    {
        ListNode* pNode = *pHead;
        while(pNode->m_pNext != NULL)
        {
            pNode = pNode->m_pNext;
        }
        pNode->m_pNext = pNew;
    }
}
```



### 删除含有某值的节点

```c++
void RemoveNode(ListNode** pHead, int value)
{
    if(*pHead == NULL || **pHead == NULL)
    {
        return;
    }
    ListNode *isToBeDeteled = NULL;
    if((*pHead)->m_nValue == value)
    {
        isToBeDeleted = *pHead;
        *pHead = (*pHead)->m_pNext;
    }
    else
    {
        ListNode *pNode = *pHead;
        while(pNode->m_pNext != NULL && pNode->m_pNext->m_nValue != value)
        {
            pNode = pNode->m_pNext;
        }
        if(pNode->m_pNext != NULL && pNode->m_pNext->m_nValue == value)
        {
            isToBeDeleted = pNode->m_pNext;
            pNode->m_pNext = pNode->m_pNext->m_pNext;
        }
    }
    if(isToBeDeleted != NULL)
    {
        delete isToBeDeleted;
        isToBeDeleted = NULL;
    }
}
```

## 从尾到头打印链表

>题目描述：输入一个链表，从尾到头打印链表每个节点的值。

### 栈实现

```c++
#include<iostream>
#include<vector>
#include<stack>
using namespace std;
struct ListNode
{
    int val;
    struct ListNode *next;
    ListNode(int x) :
        val(x), next(NULL)
    {
    }
};

class Solution
{
public:
    static vector<int> printListFromTailToHead(struct ListNode* head)
    {
        stack<ListNode*> nodes;
        ListNode *pNode=head;
        vector<int> arr;
        while(pNode!=NULL)
        {
            nodes.push(pNode);
            pNode=pNode->next;
        }
        while(!nodes.empty())
        {
            pNode=nodes.top();
            arr.push_back(pNode->val);
            nodes.pop();
        }
        return arr;
    }
};
void AddToTail(ListNode** pHead, int val)
{
    ListNode* pNew = new ListNode(val);
    if(*pHead == NULL)
    {
        *pHead = pNew;
    }
    else
    {
        ListNode* pNode = *pHead;
        while(pNode->next != NULL)
        {
            pNode = pNode->next;
        }
        pNode->next = pNew;
    }
}
int main()
{
    ListNode* head = NULL;
    int i = 0;
    while(cin>>i && i != -1){
        // 注意此处的head为地址的地址，即二级指针
        AddToTail(&head, i);
    }
    //while(head != NULL)
    //{
    //    cout<<head->val;
    //    head = head->next;
    //}
    vector<int> tmp = Solution::printListFromTailToHead(head);
    for (int val : tmp)
    {
        cout << val << ' ';
    }
    return 0;
}
```

### 递归实现

```c++
// 重复部分略过
static void printListFromTailToHead(struct ListNode* head)
{
    if(head != NULL)
    {
        if(head->next != NULL)
        {
            printListFromTailToHead(head->next);
        }
        cout<<head->val<<' ';
    }
}
```
