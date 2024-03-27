基本：

    const urls = ['https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg'];
    <ImagePreview dataSource={urls} />


自定义外层宽度：

    const urls = ['https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg','https://s1.ax1x.com/2022/10/19/xsMPS0.jpg'];
 
    <div style={{width: 330}}>
      <ImagePreview
        dataSource={urls}
        options={{
          width: 100,
          height: 100,
        }}
      />
    </div>
   