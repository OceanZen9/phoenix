import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toast } from '@/components/ui/toast';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';
import { getProductById, getProductImages } from '@/services/product';
import { getProductComments, addProductComment } from '@/services/comment';
import { addToCart, addToFavorites, removeFromFavorites, isFavorite } from '@/services/cart';
import { useIsAuthenticated } from '@/stores/authStore';
import type { Product, ProductImage } from '@/types/product';
import type { Comment } from '@/types/comment';

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        console.log('[DEBUG] 开始加载商品详情, productId:', productId);

        let productData = null;
        let imagesData = [];
        let commentsData = [];

        try {
          console.log('[DEBUG] 正在获取商品信息...');
          productData = await getProductById(productId);
          console.log('[DEBUG] 商品信息获取成功:', productData);
          setProduct(productData);
        } catch (error) {
          console.error('[DEBUG] 获取商品信息失败:', error);
          throw error;
        }

        try {
          console.log('[DEBUG] 正在获取商品图片...');
          imagesData = await getProductImages(productId);
          console.log('[DEBUG] 商品图片获取成功, 数量:', imagesData.length);
          setImages(imagesData);

          const mainImage = imagesData.find(img => img.isMain);
          if (mainImage) {
            console.log('[DEBUG] 找到主图:', mainImage.imageUrl);
            setSelectedImage(mainImage.imageUrl);
          } else if (imagesData.length > 0) {
            console.log('[DEBUG] 未找到主图，使用第一张:', imagesData[0].imageUrl);
            setSelectedImage(imagesData[0].imageUrl);
          } else {
            console.log('[DEBUG] 没有商品图片');
          }
        } catch (error) {
          console.error('[DEBUG] 获取商品图片失败:', error);
        }

        try {
          console.log('[DEBUG] 正在获取商品评论...');
          commentsData = await getProductComments(productId);
          console.log('[DEBUG] 商品评论获取成功, 数量:', commentsData.length);
          console.log('[DEBUG] 评论原始数据:', JSON.stringify(commentsData, null, 2));
          if (commentsData.length > 0) {
            console.log('[DEBUG] 第一条评论的user对象:', commentsData[0].user);
          }
          setComments(commentsData);
        } catch (error) {
          console.error('[DEBUG] 获取商品评论失败:', error);
        }

        setIsFav(isFavorite(productId));
        console.log('[DEBUG] 商品详情加载完成');
      } catch (error) {
        console.error('[DEBUG] 加载商品详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    setToastMessage('已加入购物车');
    setShowToast(true);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    if (isFav) {
      removeFromFavorites(product.productId);
      setIsFav(false);
    } else {
      addToFavorites(product);
      setIsFav(true);
      setToastMessage('已加入收藏夹');
      setShowToast(true);
    }
  };

  const handleAddComment = async () => {
    if (!productId || !newComment.trim()) return;
    if (!isAuthenticated) {
      setToastMessage('请先登录');
      setShowToast(true);
      return;
    }

    try {
      await addProductComment(productId, {
        content: newComment,
        rating: newRating
      });
      const updatedComments = await getProductComments(productId);
      setComments(updatedComments);
      setNewComment('');
      setNewRating(5);
      setToastMessage('评论发布成功');
      setShowToast(true);
    } catch (error) {
      console.error('发布评论失败:', error);
      setToastMessage('发布评论失败');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <p className="text-center text-muted-foreground">商品不存在</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <span className="text-6xl text-slate-400">📦</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.imageUrl)}
                className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-colors ${
                  selectedImage === image.imageUrl
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground'
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`${product.name} - ${image.sortOrder}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-red-600">¥{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ¥{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    省¥{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>库存：{product.stock}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>已售：{product.soldQuantity || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>分类：{product.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>上架时间：{new Date(product.createdAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">商品描述</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              加入购物车
            </Button>
            <Button
              variant={isFav ? 'default' : 'outline'}
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品评论 ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthenticated && (
            <div className="space-y-3 pb-6 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">评分：</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= newRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="分享你的使用体验..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment}>发布评论</Button>
            </div>
          )}

          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">暂无评论</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <Avatar>
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{(comment.user.nickname || '匿名用户').charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{comment.user.nickname || '匿名用户'}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < comment.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdTime).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default ProductDetailPage;
