---
title: 剑指offer算法题——查找
date: 2018-2-8 22:04:33
categories:
- 面试
tags: 面试, 算法
path: /offer-find/
---
## 单例模式

### 加同步锁前两次后判断实例是否存在

>Singleton加锁模式确保多线程下只创建一个实例

>缺点：实现复杂，容易出错

```c++
public sealed class Singleton3
{
    private Singleton3()
    {
    }
    private static object syncObj = new Object();
    private static Singleton3 instance = null;
    public static Singleton3 Instance
    {
        get
        {
            if(instance == null)
            {
                lock(syncObj){
                    if(instance == null)
                    {
                        instance = new Singleton3();
                    }
                }
            }
            return instance;
        }
    }
}
```



### 利用静态构造函数（C#版）

>C#语法中有一个函数能够确保只调用一次，即静态构造函数

>缺点：第一次用到Singleton4的时候就被创建，不能按需创建

```c++
public sealed class Singleton4
{
    private Sinleton4(){

    }
    private static Singleton4 instance = new Singleton4();
    public static Sinleton4 Instance
    {
        get
        {
            return instance;
        }
    }
}
```

### 实现按需创建实例

```c++
public sealed class Sinleton5
{
    Singleton5()
    {
    }
    public static Singleton5 Instance
    {
        get
        {
            return Nested.instance;
        }
    }
    class Nested
    {
        static Nested()
        {
        }
        internal static readonly Sington5 instance = new Singleton5();
    }
}
```

## 二维数组中的查找

>在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

>要点：从右上角开始遍历，遍历值小于目标值排除此行即到下一行找，大于的话排除此列即到上一列开始找，直到找到为止。

```c++
#include<iostream>
#include<cstring>
#include<vector>
using namespace std;
class Solution
{
public:
    bool Find(int target, vector<vector<int> > array)
    {
        if(array.empty()) return false;
        bool found = false;
        int row = 0;
        int column = array.size()-1;
        while(row < array[0].size() && column >= 0)
        {
            if(array[row][column]==target)
            {
                found=true;
                break;
            }
            else if(array[row][column]<target)
            {
                row++;
            }
            else
            {
                column--;
            }
        }
        return found;
    }
};
int main()
{
    int n;
    vector<vector<int>> a = {{1,2,8,9},{2,4,9,12},{4,7,10,13},{6,8,11,15}};
    while(cin>>n)
    {
        Solution s;
        bool found = s.Find(n, a);
        cout<<found<<endl;
    }
    return 0;
}
```

## 替换空格

>请实现一个函数，将一个字符串中的空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。

>思路：从后往前替换会好的多，合并两个数组时也可以考虑从后往前复制

```c++
#include<iostream>
#include<cstring>
#include<vector>
using namespace std;
class Solution
{
public:
    /*length为字符串容量，不是字符串的长度*/
    void replaceSpace(char *str,int length)
    {
        if(str == NULL && length <= 0)
        {
            return;
        }
        int numberOfBlank = 0;
        int originalLength = 0;
        while(str[originalLength]!='\0')
        {
            if(str[originalLength]==' ')
            {
                numberOfBlank++;
            }
            originalLength++;
        }
        int newLength = originalLength + 2 * numberOfBlank;
        if(newLength > length)
        {
            return;
        }
        int indexOfNew = newLength;
        int indexOfOriginal = originalLength;
        // 可能有字符串不存在空格的情况
        while(indexOfOriginal >= 0 && indexOfNew >= indexOfOriginal)
        {
            if(str[indexOfOriginal] == ' ')
            {
                str[indexOfNew--] = '0';
                str[indexOfNew--] = '2';
                str[indexOfNew--] = '%';
            }
            else
            {
                str[indexOfNew--] = str[indexOfOriginal];
            }
            indexOfOriginal--;
        }
    }
};
int main()
{
    char str[1000];
    while(cin.getline(str, 1000))
    {
        Solution s;
        s.replaceSpace(str, 1000);
        cout<<str<<endl;
    }
    return 0;
}
```

## 旋转数组的最小数字

>把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。 输入一个非递减排序的数组的一个旋转，输出旋转数组的最小元素。 例如数组{3,4,5,1,2}为{1,2,3,4,5}的一个旋转，该数组的最小值为1。 NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。

>思路：注意1，1，1，0，1这种情况，只能遍历得出结果


```c++
#include<iostream>
#include<vector>
using namespace std;

class Solution {
public:
    static int minNumberInRotateArray(vector<int> rotateArray) {
        if(rotateArray.size() <= 0)
        {
            return 0;
        }
        int index1 = 0;
        int index2 = rotateArray.size() - 1;
        // 考虑到数组有可能全部一样，初始化为index1
        int mid = index1;
        while(rotateArray[index1] >= rotateArray[index2])
        {
            if(index2 - index1 == 1)
            {
                mid = index2;
                break;
            }
            mid = (index1 + index2) / 2;
            if(rotateArray[mid] == rotateArray[index1] && rotateArray[mid] == rotateArray[index2])
            {
                int min = rotateArray[index1];
                for(int i = index1; i < index2; i++)
                {
                    if(rotateArray[i] < min)
                    {
                        min = rotateArray[i];
                    }
                }
                return min;
            }
            if(rotateArray[index1] <= rotateArray[mid])
            {
                index1 = mid;
            }else if(rotateArray[index2] >= rotateArray[mid])
            {
                index2 = mid;
            }
        }
        return rotateArray[mid];
    }
};
int main()
{
    int a[1000];
    int n = 0;
    while(cin>>n)
    {
        for(int i = 0; i < n; i++)
        {
            cin>>a[i];
        }
        if(n > 0)
        {
            vector<int> arr(a,a+n);
            cout<<Solution::minNumberInRotateArray(arr)<<endl;
        }
    }
    return 0;
}
```